# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - heading "AutoTest Demo" [level=1] [ref=e5]
      - navigation [ref=e6]:
        - list [ref=e7]:
          - listitem [ref=e8]:
            - link "首页" [ref=e9] [cursor=pointer]:
              - /url: /
          - listitem [ref=e10]:
            - link "轮播图" [ref=e11] [cursor=pointer]:
              - /url: /carousel
          - listitem [ref=e12]:
            - link "表单交互" [ref=e13] [cursor=pointer]:
              - /url: /form
          - listitem [ref=e14]:
            - link "动态内容" [ref=e15] [cursor=pointer]:
              - /url: /dynamic
  - generic [ref=e17]:
    - heading "欢迎来到自动化测试练习靶场" [level=2] [ref=e18]
    - paragraph [ref=e19]: 这个项目旨在提供各种常见的前端交互场景，用于练习 Web 自动化测试（如 Selenium, Playwright, Cypress 等）。
    - heading "包含的场景：" [level=3] [ref=e20]
    - list [ref=e21]:
      - listitem [ref=e22]:
        - strong [ref=e23]: "轮播图 (Carousel):"
        - text: 测试复杂的组件交互和可见性等待。
      - listitem [ref=e24]:
        - strong [ref=e25]: "表单 (Form):"
        - text: 测试输入、验证和异步提交。
      - listitem [ref=e26]:
        - strong [ref=e27]: "动态内容 (Dynamic Content):"
        - text: 测试 DOM 元素的变化、添加和删除。
  - contentinfo [ref=e28]:
    - paragraph [ref=e29]: 自动化测试示例项目 © 2024
```