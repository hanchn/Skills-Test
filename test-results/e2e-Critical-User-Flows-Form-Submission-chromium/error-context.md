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
    - heading "表单交互示例" [level=2] [ref=e18]
    - paragraph [ref=e19]: 自动化测试挑战：
    - list [ref=e20]:
      - listitem [ref=e21]: 输入合法和非法数据。
      - listitem [ref=e22]: 验证错误提示信息。
      - listitem [ref=e23]: 提交表单并验证成功响应（异步提交）。
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]: "用户名 (Username):"
        - textbox "用户名 (Username):" [ref=e27]:
          - /placeholder: 请输入用户名
      - generic [ref=e28]:
        - generic [ref=e29]: "邮箱 (Email):"
        - textbox "邮箱 (Email):" [ref=e30]:
          - /placeholder: 请输入邮箱
      - button "提交" [ref=e31] [cursor=pointer]
```