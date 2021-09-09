import React from 'react'
import { NextPage } from 'next'
import { Button, Row, Col } from 'antd'

const HomePage: NextPage = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button>test</Button>
      </Col>
    </Row>
  )
}

export default HomePage
