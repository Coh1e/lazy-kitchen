# 中英术语表 / Bilingual glossary

> 真源在 `data/glossary.yaml`，本页是其可读镜像。
> AI 翻译护栏：任何调料 / 食材 / 工艺出现在 yaml 之前，必须在 glossary 查得到。

## 为什么这页存在

中餐英译有大量陷阱:

- **大料** ≠ "big spice" → **Star anise**
- **花椒** ≠ "black pepper" → **Sichuan peppercorn**
- **生抽** ≠ "soy sauce" 笼统 → **Light soy sauce**（与老抽区分）
- **南姜** ≠ "ginger" → **Galangal**

LK 把每条对应关系固化下来，AI 调 add-dish skill 时必须查 glossary，不许擅自翻译。

## 第一批术语（约 50 条）

详见 `data/glossary.yaml` 完整列表。下面是分类速览：

### 酱油类
- 生抽 → Light soy sauce
- 老抽 → Dark soy sauce
- 蚝油 → Oyster sauce
- 鱼露 → Fish sauce

### 醋类
- 米醋 → Rice vinegar (≠ white vinegar)
- 黑醋 → Chinese black vinegar / Chinkiang vinegar

### 整香料
- 八角 / 大料 → Star anise (≠ big spice)
- 香叶 → Bay leaf
- 桂皮 → Cassia bark / Chinese cinnamon (中餐多用 cassia)
- 白胡椒粒 → White peppercorn
- 花椒 → Sichuan peppercorn (≠ black pepper)
- 陈皮 → Dried tangerine peel
- 干辣椒 → Dried chili

### 干鲜
- 出汁粉 → Dashi powder (≠ broth powder)
- 干香菇 → Dried shiitake mushrooms
- 海带 → Kombu / dried kelp

### 生鲜香辛
- 姜 → Ginger
- 蒜 → Garlic
- 葱 → Scallion / green onion
- 香茅 → Lemongrass
- 南姜 → Galangal (≠ ginger)
- 柠檬叶 → Makrut lime leaves (避免争议词 'kaffir')

### 蛋白质
- 牛腩 → Beef brisket / beef flank
- 五花肉 → Pork belly
- 鸡腿肉 → Chicken thigh
- 虾仁 → Peeled shrimp

### 蔬菜
- 白萝卜 → Daikon radish
- 卷心菜 / 圆白菜 → Cabbage

### 主食
- 河粉 → Rice noodles / flat rice noodles
- 乌冬 → Udon

### 工艺
- 焯水 → Blanch
- 红烧 → Hongshao braise / red-braise
- 上浆 → Velveting

## 怎么贡献新术语

如果你 add-dish 时遇到 glossary 没有的词，skill 会触发 Step 4 子流程跟你确认 zh / en / alias / category 后追加。
也可以直接提 PR 加。
