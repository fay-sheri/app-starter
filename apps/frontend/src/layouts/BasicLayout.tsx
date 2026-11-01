import type { ReactNode } from 'react'
import { Layout } from 'antd'

const { Header, Content, Footer } = Layout

interface BasicLayoutProps {
  header?: ReactNode
  content?: ReactNode
  footer?: ReactNode
  className?: string
}

export function BasicLayout({
  header,
  content,
  footer,
  className,
}: BasicLayoutProps) {
  return (
    <Layout className={` h-screen ${className ?? ''}`}>
      {header !== undefined && <Header>{header}</Header>}
      <Content>{content}</Content>
      {footer !== undefined && <Footer>{footer}</Footer>}
    </Layout>
  )
}