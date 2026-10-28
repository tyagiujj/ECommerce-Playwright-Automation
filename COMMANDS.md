# Commands Cheat Sheet

Is project ko chalane ki saari commands, aur har command kyu aur kab use hoti hai.
Saare scripts `package.json` ke `"scripts"` section me defined hain.

---

## Script ka structure

```json
"test:headed": "playwright test --headed"
   ↑ naam (key)          ↑ asli command (value)
```

- **Key:** wo naam jo terminal me likhte ho (`npm run test:headed`).
- **Value:** wo command jo npm tumhare liye chalata hai.
- npm commands ko `node_modules/.bin` me dhoondhta hai, isliye `npx` nahi lagana padta.
- `:` (colon) sirf naming convention hai, taki related scripts ek group me dikhein.

### Yaad rakhne ke 3 rules
1. `test` script: `npm test` (shortcut, `run` nahi lagta).
2. Baaki saare scripts: `npm run <naam>`.
3. Extra arguments (file ka naam, `-g`, etc.) `--` ke **baad** aate hain. `--` npm ko batata hai ki aage wale arguments Playwright ko de do.

---

## Saare scripts

| Script | Command | Ek line me |
|---|---|---|
| `npm test` | `playwright test` | Saare tests chalao, browser nahi dikhega |
| `npm run test:headed` | `playwright test --headed` | Tests chalao, browser dikhega |
| `npm run test:ui` | `playwright test --ui` | Visual UI window me tests chalao |
| `npm run test:debug` | `playwright test --debug` | Inspector me line-by-line chalao |
| `npm run test:list` | `playwright test --list` | Sirf list dikhao, chalao mat |
| `npm run report` | `playwright show-report` | Last HTML report kholo |
| `npm run typecheck` | `tsc --noEmit` | Bina browser ke code errors check karo |

---

## Detail me

### `npm test`
- `playwright.config.ts` padhta hai, `testDir: './tests'` ke andar saari `.spec.ts` files chalata hai.
- Default me **headless** (browser screen pe nahi dikhta), isliye fast hai.
- **Kab:** saare tests chalane ke liye, aur CI me.

### `npm run test:headed`
- `--headed` = browser screen pe dikhega. Thoda slow hai.
- **Kab:** test fail ho aur dekhna ho ki test kya click kar raha hai.

### `npm run test:ui`
- `--ui` = Playwright **UI Mode** (alag window): tests ki list, har step ka timeline, DOM snapshot, network calls, watch mode.
- **Kab:** naya test likhte waqt ya debugging me. Daily kaam ke liye sabse useful.

### `npm run test:debug`
- `--debug` = **Playwright Inspector** khulta hai, test pehli line pe ruk jata hai. Timeout apne aap band ho jata hai.
- **Kab:** koi locator kaam nahi kar raha aur exact line pe rukna ho.

### `npm run test:list`
- `--list` = tests chalata nahi, sirf list dikhata hai.
- **Kab:** check karna ho ki files load ho rahi hain, imports toote to nahi, ya `-g` filter sahi tests pakad raha hai.

### `npm run report`
- Last run ki HTML report kholta hai (`playwright-report/` folder se): pass/fail, error, screenshot, video, trace.
- **Kab:** test run ke baad, khaaskar jab koi test fail ho.

### `npm run typecheck`
- `tsc` = TypeScript compiler. `--noEmit` = sirf errors check karo, `.js` files mat banao (Playwright khud TypeScript chala leta hai).
- `tsconfig.json` padhta hai (strict mode, path aliases). 2-3 second me galat import, galat method name ya type mistake pakad leta hai.
- **Kab:** commit karne se pehle, hamesha.

---

## Roz kaam aane wale examples

```
npm test                                           # saare tests
npm test -- tests/SearchProduct.spec.ts            # ek file
npm test -- -g "Search Product"                    # naam se filter (-g = grep)
npm run test:headed -- tests/SearchProduct.spec.ts # ek file, browser dikhega
npm run test:debug -- tests/SearchProduct.spec.ts  # ek file, line-by-line
npm run test:list -- -g "Login"                    # check karo filter kaun se tests pakadta hai
npm run typecheck                                  # commit se pehle
npm run report                                     # run ke baad report
```

---

## Interview tip

**Q:** `npx playwright test` aur `npm test` me kya fark hai?

**A:** Result same hai, par `npm test` project ka standard entry point hai. Command `package.json` me ek jagah define hai, aur CI aur local dono same command use karte hain. Flag badalna ho to sirf ek jagah badlega.
