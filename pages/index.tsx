import React, { useState } from 'react'
import { Typography, Statistic, Divider, Button, Card, Row, Col } from 'antd'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

import toonie from '../public/images/toonie.png'
import loonie from '../public/images/loonie.png'
import quarter from '../public/images/quarter.png'
import dime from '../public/images/dime.png'
import nickel from '../public/images/nickel.png'

interface Coin {
  name: string
  value: number
  src: StaticImageData
}

const coins: Coin[] = [
  {
    name: 'toonie',
    src: toonie,
    value: 2,
  },
  {
    name: 'loonie',
    src: loonie,
    value: 1,
  },
  {
    name: 'quarter',
    src: quarter,
    value: 0.25,
  },
  {
    name: 'dime',
    src: dime,
    value: 0.1,
  },
  {
    name: 'nickel',
    src: nickel,
    value: 0.05,
  },
]

interface CoinCount extends Coin {
  count: number
}

const getBestCoinCount = (
  change: number
): {
  coinCount: CoinCount[]
  missingChange: number
  realChange: number
} => {
  const coinCount = coins
    .map((coin: Coin): CoinCount => ({ ...coin, count: 0 }))
    .sort((prev, curr) => curr.value - prev.value)

  let missingChange = change
  let coinIndex = 0
  const limit = -0.02

  while (missingChange > limit && coinIndex < coinCount.length) {
    const newChange = missingChange - coinCount[coinIndex].value
    if (newChange > limit) {
      coinCount[coinIndex].count = coinCount[coinIndex].count + 1
      missingChange = newChange
    } else {
      coinIndex = coinIndex + 1
    }
  }

  const realChange = coinCount.reduce((total, { value, count }) => {
    return total + count * value
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
          <Card>
            <Row gutter={[8, 8]}>
              {coinCount.map(({ count, name, src }) =>
                [...Array(count)].map((_, index) => (
                  <Col key={`${name}-${index}`} xs={5} sm={2} md={1}>
                    <Image layout="responsive" alt={name} src={src} />
                  </Col>
                ))
              )}
            </Row>
          </Card>
          <br />
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8} md={4}>
              <Card>
                <Statistic title="You Give" value={toCad(realChange)} />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Card>
                <Statistic title="Exact" value={toCad(change)} />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4}>
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
