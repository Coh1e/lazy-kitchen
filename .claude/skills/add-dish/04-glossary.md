# Step 4: Glossary 审核子流程 (Glossary review)

详见 `skills/add-dish/workflow.md` Step 4.

## 触发

Step 3b 中遇到术语不在 `data/glossary.yaml`。

## 操作

对每个新术语：

1. 查找权威译法（用你的内部知识）
2. 输出建议:
   ```
   新词: 'gochugaru'
   建议: { zh: 韩式粗辣椒粉, en: Korean coarse chili flakes }
   alias_zh: ['辣椒粉']  
   alias_en: ['Korean chili powder', 'gochugaru']
   category: ground-spice
   do_not_translate_as: ['Korean chili powder']  (因为常被误译)
   ```
3. 询问: "OK 加入？要改 zh/en/alias/category 哪一项？"
4. yes → 暂存到候选列表（**不写文件**）
5. 全部术语处理完 → 一次性 append 到 `data/glossary.yaml`

## 不可越权

- 绝不静默假设译法
- 绝不批量加入未确认的术语
- 必须给出 do_not_translate_as 字段（防止后续 AI 翻车）
