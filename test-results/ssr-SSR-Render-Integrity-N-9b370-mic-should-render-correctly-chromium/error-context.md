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
    - heading "动态内容示例" [level=2] [ref=e18]
    - paragraph [ref=e19]: 自动化测试挑战：
    - list [ref=e20]:
      - listitem [ref=e21]: 点击按钮动态添加列表项。
      - listitem [ref=e22]: 定位并点击新添加项中的“删除”按钮。
      - listitem [ref=e23]: 验证列表项数量的变化。
    - generic [ref=e24]:
      - textbox "输入新项目名称" [ref=e25]
      - button "添加项目" [ref=e26] [cursor=pointer]
    - list [ref=e27]:
      - listitem [ref=e28]:
        - generic [ref=e29]: 示例项目 1
        - button "删除" [ref=e30] [cursor=pointer]
  - contentinfo [ref=e31]:
    - paragraph [ref=e32]: 自动化测试示例项目 © 2024
```