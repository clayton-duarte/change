import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps, NextPage } from 'next'
import {
  Typography,
  Statistic,
  Divider,
  Button,
  Table,
  Card,
  Row,
  Col,
} from 'antd'

const getBestCoinCount = (
  change: number
): {
  coinCount: { coin: number; count: number }[]
  missingChange: number
  realChange: number
} => {
  const coinCount = [0.05, 0.1, 0.25, 1, 2]
    .map((coin) => ({ coin, count: 0 }))
    .sort((prev, curr) => curr.coin - prev.coin)

  let missingChange = change
  let coinIndex = 0
  const limit = -0.03

  while (missingChange > limit && coinIndex < coinCount.length) {
    const newChange = missingChange - coinCount[coinIndex].coin
    if (newChange > limit) {
      coinCount[coinIndex].count = coinCount[coinIndex].count + 1
      missingChange = newChange
    } else {
      coinIndex = coinIndex + 1
    }
  }

  const realChange = coinCount.reduce((total, { coin, count }) => {
    return total + count * coin
  }, 0)

  return {
    missingChange,
    realChange,
    coinCount,
  }
}

const toCad = (a: number): string =>
  a.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })

interface PageProps {
  check: number
  bill: number
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const bills = [20, 50, 100]
  const bill = bills[Math.floor(Math.random() * bills.length)]
  const check = bill - Math.random() * 10
  return { props: { bill, check } }
}

const HomePage: NextPage<PageProps> = ({ bill, check }) => {
  // STATES
  const [viewSolution, setViewSolution] = useState(false)

  // CONSTS
  const { Title, Text, Paragraph } = Typography
  const router = useRouter()
  const change = bill - check
  const { coinCount, missingChange, realChange } = getBestCoinCount(change)

  // RENDER
  return (
    <>
      <Title>Exercise</Title>
      <Divider />
      <Title level={4}>
        You received <Text type="success">{toCad(bill)}</Text> to pay for{' '}
        <Text type="danger">{toCad(check)}</Text>
      </Title>
      <Paragraph>How much should be the change?</Paragraph>
      {viewSolution ? (
        <>
          <Row gutter={[24, 24]}>
            <Col>
              <Card>
                <Table
                  pagination={false}
                  dataSource={coinCount}
                  columns={[
                    {
                      title: 'Coin',
                      dataIndex: 'coin',
                      key: 'coin',
                    },
                    {
                      title: 'Count',
                      dataIndex: 'count',
                      key: 'count',
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col>
              <Card>
                <Statistic title="Exact" value={toCad(change)} />
              </Card>
              <br />
              <Card>
                <Statistic title="You Give" value={toCad(realChange)} />
              </Card>
              <br />
              <Card>
                <Statistic title="Difference" value={toCad(-missingChange)} />
              </Card>
            </Col>
          </Row>
          <br />
          <Button
            type="primary"
            onClick={() => {
              setViewSolution(false)
              router.replace(router.pathname)
            }}
          >
            New Exercise
          </Button>
        </>
      ) : (
        <Row>
          <Button
            type={viewSolution ? 'default' : 'primary'}
            onClick={() => setViewSolution(!viewSolution)}
          >
            View Solution
          </Button>
        </Row>
      )}
    </>
  )
}

export default HomePage
