# Color Design Rationale — Gym Training Visualization
## Evidence-based justification for the ITU Data Visualization exam

---

## 1. Foundational principle: color as data-ink

The core constraint on all color decisions in this app comes from **Tufte (1983)**:

> *"Above all else show the data."* — Edward Tufte, *The Visual Display of Quantitative Information*, Graphics Press, 1983.

Tufte's **data-ink ratio** holds that every drop of ink (or pixel of color) should either encode data or be removed. Color used for decoration is chartjunk; color used to differentiate categories or encode magnitude is data-ink. This principle governs the choice to restrict color to:

- the chart line / bar fills / heatmap cells (the actual data)
- the per-muscle identity dot in the dropdown and dashboard header
- the diverging body heatmap on the landing page

Everything structural — header backgrounds, card surfaces, typography — is near-neutral stone (`#FAFAF7`, `#F0EDE8`, `#1C1917`), contributing no hue signal of its own.

**Cairo (2016)** extends this in *The Truthful Art*:

> Color should never carry more meaning than the data supports. If two categories have similar values, giving them visually distant colors implies a difference that does not exist in the data.

— Alberto Cairo, *The Truthful Art: Data, Charts, and Maps for Communication*, New Riders, 2016. ([Publisher page](https://www.newriders.com/products/the-truthful-art))

This is a direct argument for the 2–3 hue rule applied below, and for the choice to use lightness/saturation variation within hue families rather than 12 fully distinct arbitrary pastels.

---

## 2. The 2–3 hue rule (Cairo's restraint principle)

Cairo, in both *The Functional Art* (2012) and *The Truthful Art* (2016), advocates picking **2 to 3 base hues** and using lightness and saturation variation — not additional hues — for sub-categories. The rationale: each new hue introduced is a new categorical channel, implying a new type of meaningful difference. Sub-categories within a type should share a hue and vary only in luminance or chroma.

**Applied to this app:**

| Hue | Role | Hex | Justification |
|---|---|---|---|
| Terracotta | Warm accent: gains, PRs, "above average" end of diverging scale, brand identity | `#B5451B` | Warm=exciting (Bartram et al. 2017); arousal signal (Elliot & Aarts 2011) |
| Slate blue | Cool anchor: regression, "below average" end of diverging scale | `#1A4A6B` | Cool=calm (Bartram et al. 2017); perceptual contrast to terracotta |
| Stone neutral | Structural: backgrounds, typography, borders | `#FAFAF7` / `#1C1917` | Data-ink minimization (Tufte 1983; Few 2008) |

The **12 muscle group colors** are derived from these two hues by grouping muscles anatomically and varying lightness and saturation within each hue family — not by introducing 12 arbitrary independent hues. This keeps the palette perceptually coherent and the Cairo 2–3 rule intact at the system level, even though individual colors differ per muscle.

**Anterior chain** (chest, biceps, abs, shoulders, quads, triceps) → warm family (terracotta/amber tones)  
**Posterior chain** (lats, traps, rear delts, glutes, hamstrings, calves) → cool-neutral family (slate/teal tones)

This grouping is *meaningful* — it mirrors the anterior/posterior anatomical split — which makes the color encoding truthful in Cairo's sense: color difference signals category difference that is real in the data domain.

---

## 3. Categorical color: how many distinct hues are discriminable?

The authoritative empirical finding on categorical color limits:

**Healey, C.G. (1996). "Choosing Effective Colours for Data Visualization." *Proceedings of IEEE Visualization '96*, pp. 263–270.**  
→ [PDF via Brown University](https://vis.cs.brown.edu/docs/pdf/Healey-1996-CEC.pdf)

Healey tested 38 observers and found that **up to 7 isoluminant categorical colors** can be rapidly and accurately discriminated; error rates rose to ~8% at 9 colors and continued climbing. This is the strongest primary empirical source for the ≤7 categorical hue guideline.

**Ware, C. (2020). *Information Visualization: Perception for Design*, 4th ed. Morgan Kaufmann.**  
→ gives ~12 as a practical upper bound for nominal categorical coding. The range 7–12 represents the span between strict preattentive discrimination (Healey) and slower deliberate reading (Ware).

**Few, S. (2008). "Practical Rules for Using Color in Charts." Perceptual Edge.**  
→ [Perceptual Edge blog](http://joyfulpublicspeaking.blogspot.com/2008/09/practical-rules-for-using-color-in.html)  
Recommends 6 as the default, 12 as the absolute maximum. "Use different colors only when they correspond to differences of meaning in the data."

**Implication for this app:** The landing page body diagram has 12 muscle regions — at the outer edge of the discriminability limit. The mitigation (stated in the README, defensible at the oral exam) is that color on the landing page is a *secondary* encoding: spatial position on the anatomical diagram is the primary encoder. The color is redundant reinforcement, not the only signal. This is exactly the correct defense per Healey (1996): discrimination limits apply most strictly when color is the *sole* channel.

---

## 4. Warm colors communicate energy in data visualization

The most directly relevant peer-reviewed finding for the design question:

**Bartram, L., Patra, A., & Stone, M. (2017). "Affective Color in Visualization." *Proceedings of CHI '17*, pp. 1364–1374. DOI: [10.1145/3025453.3026041](https://doi.org/10.1145/3025453.3026041)**

Across three studies with participants rating data visualizations (not interior design or marketing), Bartram et al. found that **warm, higher-chroma palettes were reliably associated with "exciting," "playful," and "positive" affect**, while cool, lower-chroma palettes were associated with "calm" and "trustworthy." This is the most direct peer-reviewed evidence that warm color choice in a data visualization communicates energy — not just in general psychology, but specifically in the context of charts and dashboards.

**Labrecque, L.I., & Milne, G.R. (2012). "Exciting Red and Competent Blue: The Importance of Color in Marketing." *Journal of the Academy of Marketing Science* 40(5):711–727. DOI: [10.1007/s11747-010-0245-y](https://doi.org/10.1007/s11747-010-0245-y)**

Red branding signaled excitement; blue signaled competence and trust. Consistent with the arousal literature and relevant for a fitness app where excitement/energy is the brand register.

**Valdez, A., & Mehrabian, A. (1994). "Effects of Color on Emotions." *Journal of Experimental Psychology: General* 123(4):394–409. DOI: [10.1037/0096-3445.123.4.394](https://doi.org/10.1037/0096-3445.123.4.394)**

Established that brightness and saturation drive the majority of affective color response; hue has a secondary but real effect. Blue-green rated most pleasant; high-saturation warm hues rated most activating. This justifies the desaturated warm accent chosen here (terracotta `#B5451B` rather than pure red) — high enough chroma to signal energy, low enough to avoid anxiety.

---

## 5. Warm colors and physiological arousal in physical performance contexts

**Elliot, A.J., & Aarts, H. (2011). "Perception of the color red enhances the force and velocity of motor output." *Emotion* 11(2):445–449. DOI: [10.1037/a0022599](https://doi.org/10.1037/a0022599)**  
→ [PubMed](https://pubmed.ncbi.nlm.nih.gov/21500913/)

Participants who viewed red before a handgrip/pinchgrip task exerted significantly greater force and velocity than those who viewed blue or gray (all matched on lightness and chroma). This is the strongest experimental evidence that warm color briefly increases physical output — directly relevant to a gym tracking app where the user views the app before and after training.

**Jacobs, K.W., & Hustmyer, F.E. (1974). "Effects of Four Psychological Primary Colors on GSR, Heart Rate and Respiration Rate." *Perceptual and Motor Skills* 38(3):763–766. DOI: [10.2466/pms.1974.38.3.763](https://doi.org/10.2466/pms.1974.38.3.763)**  
→ [SAGE](https://journals.sagepub.com/doi/10.2466/pms.1974.38.3.763)

Red produced significantly greater galvanic skin response (GSR — a physiological arousal index) than blue or yellow. Foundational arousal evidence for warm color choice.

**Küller, R., Mikellides, B., & Janssens, J. (2009). "Color, arousal, and performance — A comparison of three experiments." *Color Research & Application* 34(2):141–152. DOI: [10.1002/col.20476](https://doi.org/10.1002/col.20476)**  
→ [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1002/col.20476) | [Semantic Scholar](https://www.semanticscholar.org/paper/Color,-arousal,-and-performance%E2%80%94A-comparison-of-K%C3%BCller-Mikellides/5601de35b06560b180e2539b8ecec30d667d6b90)

"Strong, especially red, colors and patterns put the brain into a more excited state." Three independent experiments converging on the same direction.


## 6. Diverging color scales: the ColorBrewer framework

**Brewer, C.A. (1996). "Guidelines for Selecting Colors for Diverging Schemes on Maps." *The Cartographic Journal* 33(2):79–86. DOI: [10.1179/caj.1996.33.2.79](https://doi.org/10.1179/caj.1996.33.2.79)**  
→ [Taylor & Francis](https://www.tandfonline.com/doi/abs/10.1559/152304003100010929)

Brewer defines diverging schemes: two hues of equal perceptual weight anchoring a light neutral midpoint, used when data has a meaningful critical value (zero, goal, average) and values on either side have opposite interpretations. This is the direct academic source for the body heatmap's 5-stop diverging scale (slate blue → light slate → stone gray → warm sand → terracotta) centered at "no change."

Brewer defines three palette families — sequential, diverging, and qualitative — and provides design guidelines for each. The body heatmap uses a multi-hue sequential scheme in the warm orange-red family, ranging from a near-white tint to a deep earthy red, following Brewer's recommendation for sequential schemes where step discrimination matters and no meaningful critical midpoint exists. A diverging scheme was considered and rejected: a cold-to-warm axis would encode a value judgment (decline = bad) that is not supported by the data — lower volume in a given week may reflect a planned deload or recovery, not failure. Brewer's sequential framework supports this framing by treating the encoded variable as ordered magnitude rather than deviation from a norm.

**Harrower, M., & Brewer, C.A. (2003). "ColorBrewer.org: An Online Tool for Selecting Colour Schemes for Maps." *The Cartographic Journal* 40(1):27–37. DOI: [10.1179/000870403235002405](https://doi.org/10.1179/000870403235002405)**  
→ [Taylor & Francis](https://www.tandfonline.com/doi/abs/10.1559/152304003100010929) | [ColorBrewer tool](https://colorbrewer2.org)

The ColorBrewer tool and the three palette families (sequential, diverging, qualitative) with colorblind-safe filters. This is the standard practical reference cited in virtually all data visualization textbooks.

**Borland, D., & Taylor, R.M. (2007). "Rainbow Color Map (Still) Considered Harmful." *IEEE Computer Graphics and Applications* 27(2):14–17. DOI: [10.1109/MCG.2007.323435](https://doi.org/10.1109/MCG.2007.323435)**  
→ [IEEE ADS](https://ui.adsabs.harvard.edu/abs/2007ICGA...27b..14B/abstract)

Rainbow/jet colormaps are perceptually non-monotone, introduce false banding, and mislead interpretation. The argument for using a perceptually ordered diverging scale (dark → light → dark, two hues) rather than a rainbow.

**Moreland, K. (2009). "Diverging Color Maps for Scientific Visualization." *ISVC '09*, LNCS 5876:92–103. DOI: [10.1007/978-3-642-10520-3_9](https://doi.org/10.1007/978-3-642-10520-3_9)**  
→ [Kenneth Moreland's site](https://www.kennethmoreland.com/color-advice/)

The smooth cool-to-warm diverging map, now the default in ParaView and VTK, designed so both ends read as equally "far" from the neutral middle. The theoretical basis for the design choice of symmetric cool/warm anchors.

---

## 7. Colorblind accessibility

**Colour Blind Awareness. "Types of Colour Blindness."**  
→ [colourblindawareness.org](https://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/)

Approximately **8% of men and 0.5% of women** have congenital red-green color vision deficiency (deuteranopia/protanopia). The chosen diverging scale (slate blue ↔ terracotta) is partially at risk for red-green CVD because the warm end can be confused with certain greens. Mitigation: (1) the diverging scale uses luminance variation alongside hue variation — cool dark / warm dark ends vs. light middle — so the signal survives in grayscale; (2) the muscle category dots are always accompanied by the muscle name label (redundant encoding, not color-alone).

---

## 8. Cairo's *The Truthful Art* — what to take

**Cairo, A. (2016). *The Truthful Art: Data, Charts, and Maps for Communication.* New Riders.**  
→ [Publisher page](https://www.newriders.com/products/the-truthful-art)

Beyond the five qualities (truthful, functional, beautiful, insightful, enlightening), the book's most citable contributions for this project:

**On color encoding honesty:**  
Cairo argues that color should only signal differences that exist in the underlying data. Encoding all 12 muscle groups with fully distinct colors implies they are all categorically different from each other in equal measure — which is only partially true (they are anatomically distinct, but some are functionally related). Grouping by anterior/posterior and varying within-family lightness is more *truthful* than arbitrary distinctness.

**On visual hierarchy:**  
Cairo uses the concept of a "visual hierarchy" in which the most important element receives the highest visual weight (contrast, size, color saturation) and structural elements recede. This directly maps to the design choice here: the chart data gets the muscle's full accent color; the card border, axis labels, and header receive no color saturation at all.

**On the data selfie framing:**  
Cairo discusses personal data visualization as a legitimate genre — he cites Nicholas Felton's annual reports as examples of "data selfies." The personal gym log is exactly this genre, and Cairo's framework licenses the slightly warmer, more expressive aesthetic appropriate for personal data vs. journalistic or scientific visualization, where strict neutrality is required.

---

## 9. Strength-of-evidence summary

| Design decision | Evidence strength | Key citation |
|---|---|---|
| Warm accent (terracotta) for gains/PRs/brand | Strong | Bartram et al. 2017 (CHI); Labrecque & Milne 2012 |
| Cool anchor (slate) for regression/baseline | Strong | Bartram et al. 2017; Valdez & Mehrabian 1994 |
| Mostly neutral structural layer | Strong (consensus) | Tufte 1983; Few 2008; Cairo 2012/2016 |
| ≤7 categorical hues for rapid discrimination | Strong (empirical) | Healey 1996 |
| 12 muscles justified by spatial redundancy | Moderate | Healey 1996 (mitigation argument) |
| Diverging scale for body heatmap | Strong (standard practice) | Brewer 1996; Harrower & Brewer 2003 |
| Rainbow colormap avoided | Strong | Borland & Taylor 2007 |
| Warm = arousal/activation | Strong | Elliot & Aarts 2011; Jacobs & Hustmyer 1974 |
| Warm ≠ cognitive performance boost | Strong — null finding | Gnambs 2020 meta-analysis |
| 2–3 hue rule for coherence | Theoretical/Cairo | Cairo 2012/2016 |
| Cairo visual hierarchy for color weight | Theoretical | Cairo 2016 |

---

## References (alphabetical)

- Bartram, L., Patra, A., & Stone, M. (2017). Affective color in visualization. *CHI '17*, 1364–1374. https://doi.org/10.1145/3025453.3026041
- Borland, D., & Taylor, R.M. (2007). Rainbow color map (still) considered harmful. *IEEE CG&A* 27(2):14–17. https://doi.org/10.1109/MCG.2007.323435
- Brewer, C.A. (1996). Guidelines for selecting colors for diverging schemes on maps. *The Cartographic Journal* 33(2):79–86. https://doi.org/10.1179/caj.1996.33.2.79
- Cairo, A. (2012). *The Functional Art.* Peachpit Press.
- Cairo, A. (2016). *The Truthful Art.* New Riders.
- Colour Blind Awareness. Types of colour blindness. https://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/
- Elliot, A.J., & Aarts, H. (2011). Perception of the color red enhances the force and velocity of motor output. *Emotion* 11(2):445–449. https://doi.org/10.1037/a0022599
- Few, S. (2008). Practical rules for using color in charts. *Perceptual Edge.* http://joyfulpublicspeaking.blogspot.com/2008/09/practical-rules-for-using-color-in.html
- Gnambs, T. (2020). Limited evidence for the effect of red color on cognitive performance: a meta-analysis. *Psychonomic Bulletin & Review* 27(6):1374–1382. https://doi.org/10.3758/s13423-020-01772-1
- Harrower, M., & Brewer, C.A. (2003). ColorBrewer.org: an online tool for selecting colour schemes for maps. *The Cartographic Journal* 40(1):27–37. https://doi.org/10.1179/000870403235002405
- Healey, C.G. (1996). Choosing effective colours for data visualization. *Proc. IEEE Visualization '96*, 263–270. https://vis.cs.brown.edu/docs/pdf/Healey-1996-CEC.pdf
- Jacobs, K.W., & Hustmyer, F.E. (1974). Effects of four psychological primary colors on GSR, heart rate and respiration rate. *Perceptual and Motor Skills* 38(3):763–766. https://doi.org/10.2466/pms.1974.38.3.763
- Küller, R., Mikellides, B., & Janssens, J. (2009). Color, arousal, and performance. *Color Research & Application* 34(2):141–152. https://doi.org/10.1002/col.20476
- Labrecque, L.I., & Milne, G.R. (2012). Exciting red and competent blue. *JAMS* 40(5):711–727. https://doi.org/10.1007/s11747-010-0245-y
- Moreland, K. (2009). Diverging color maps for scientific visualization. *ISVC '09*, LNCS 5876:92–103. https://www.kennethmoreland.com/color-advice/
- Tufte, E. (1983). *The Visual Display of Quantitative Information.* Graphics Press.
- Valdez, A., & Mehrabian, A. (1994). Effects of color on emotions. *J. Exp. Psychol.: General* 123(4):394–409. https://doi.org/10.1037/0096-3445.123.4.394
- Ware, C. (2020). *Information Visualization: Perception for Design*, 4th ed. Morgan Kaufmann.
