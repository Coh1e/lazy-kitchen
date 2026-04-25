# 火候 + 油温 / Heat & oil temperature

两个独立维度:

## 火候档位

详见 [data/heat-tiers.yaml](../../../data/heat-tiers.yaml)。

| ID | 中文 | 英文 | 视觉 |
|---|---|---|---|
| high | 大火 | High | 锅冒烟、油哔啵声 |
| medium-high | 中大火 | Medium-high | 油面微动、下肉滋滋 |
| medium | 中火 | Medium | 油静止微暖 |
| medium-low | 中小火 | Medium-low | 锅边几乎无热感 |
| low | 小火 | Low | 汤面细密小泡 |
| simmer | 微火 | Bare simmer | 汤面几乎静止 |

## 油温档位（中式"几成热"）

详见 [data/oil-temp-tiers.yaml](../../../data/oil-temp-tiers.yaml)。

| ID | 中文 | °C | 视觉 |
|---|---|---|---|
| 1-2-cheng | 一二成热 | 30–60 | 静止无气泡 |
| 3-4-cheng | 三四成热 | 90–120 | 筷子周围小泡 |
| 5-6-cheng | 五六成热 | 150–180 | 密集小泡微烟 |
| 7-8-cheng | 七八成热 | 200–220 | 大波动明显烟 |
| 9-cheng | 九成热 | 230+ | 浓烟近燃点（仅秒级） |

每个 SOP 用 `heat_level_used` 引用火候档位，避免"中火"的模糊性。
