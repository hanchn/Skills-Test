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
    - heading "轮播图示例 (Swiper.js)" [level=2] [ref=e18]
    - paragraph [ref=e19]: 自动化测试挑战：
    - list [ref=e20]:
      - listitem [ref=e21]: 验证当前活动的 Slide 索引。
      - listitem [ref=e22]: 点击“下一张”按钮并验证 Slide 切换。
      - listitem [ref=e23]: 验证自动播放（如果启用）。
    - generic [ref=e25]:
      - generic [ref=e27]: Slide 1
      - generic [ref=e29]: Slide 2
      - generic [ref=e31]: Slide 3
      - generic [ref=e33]: Slide 4
      - generic [ref=e35]: Slide 5
  - contentinfo [ref=e36]:
    - paragraph [ref=e37]: 自动化测试示例项目 © 2024
```