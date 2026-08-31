# La Isla del Gato — portfolio jugable 3D

Portfolio de **Raúl Jiménez Ayza** (gameplay & fullstack dev) como juego 3D:
una isla con relieve, siete templos que cuentan su CV, físicas reales, doce
peces dorados escondidos, cuevas de cristal y cuatro recreativas dentro.

▶ **[Jugar](https://rauljimenezayza.github.io/portfolio-interactivo/)**

## Qué hay dentro

- Isla generada por heightmap: colinas, cresta central y costa irregular con playas.
- Siete zonas, una por sección del CV, cada una con su propia arquitectura y lore.
- Física con cannon-es: cajas empujables, bolos, dominós, balancín y rampas.
- Gato con squash & stretch, doble salto, cola articulada y pose de sentado.
- Audio sintetizado en tiempo real: música generativa con una paleta distinta
  por templo, ambiente de mar y viento, y efectos por oscilador. Sin archivos.
- Cuevas de cristal con cuatro recreativas — Pong, Snake, Simon y Mastermind —
  y récords guardados.
- Parque de atracciones en su propia isla: noria, carrusel y una montaña rusa
  que se puede montar.
- Español e inglés, controles de teclado y táctiles.

## Controles

| Tecla | Acción |
|---|---|
| `WASD` / flechas | mover al gato |
| `Shift` | correr |
| `Space` | saltar (dos veces para doble salto) |
| `E` | entrar en un templo |
| `G` | jugar al Mastermind (dentro de las Ruinas) |
| `H` | maullar |
| `R` | volver a la plaza |

## Estructura

El juego vive en **`web/`**: Next.js 14 en modo `output: "export"` con
react-three-fiber. R3F es dueño del renderer, la escena, la cámara y el
schedule; el mundo (`src/game/world.js`, ~8.400 líneas de three.js y cannon-es
imperativo) los adopta en vez de construir los suyos. Nada de la escena se
reescribió como JSX porque nada lo necesitaba: React decide *cuándo* existe una
cosa, y describir una isla generada procedimentalmente no es lo suyo.

```
web/
  app/                 la página, el shell y el CSS
  src/game/world.js    la isla entera — terreno, templos, cuevas, físicas, audio
  src/game/shell.ts    el markup que boot() espera encontrar (unos 58 ids)
  src/models/          el registro de modelos y el cargador
  public/models/       los .glb — suéltalos aquí y el build los recoge
  scripts/             manifiesto, tarjeta og, servidor de dev, verificación
```

### La carpeta de modelos

Cada modelo intercambiable tiene una clave en `src/models/registry.ts` con un
`file`, una escala, un giro, un desplazamiento y una nota que dice dónde va su
origen. Si el `.glb` está en `public/models/`, gana; si no está, corre el
`fallback` procedimental, que es como se construyó todo antes de que hubiera
carpeta. **Una carpeta vacía sigue siendo un juego completo**, y cada `.glb`
que sueltes reemplaza exactamente una cosa sin tocar código. `npm run models`
regenera el manifiesto (corre solo en `predev` y `prebuild`).

Todo lo que entre ahí necesita su fila en
[`public/models/CREDITS.md`](web/public/models/CREDITS.md).

## Desarrollo

```bash
cd web
npm ci
npm run dev        # http://localhost:3000
```

| comando | qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | export estático a `web/out/` |
| `npm run lint` | ESLint; los warnings fallan |
| `npm run verify` | comprobaciones sin navegador (ver abajo) |
| `npm run models` | regenera el manifiesto y copia el decodificador Draco |
| `npm run og` | redibuja `public/og.png`, la tarjeta para compartir |

`npm run verify` no abre un navegador: construye objetos three.js de verdad y
los mide, y lee los `.glb` directamente del contenedor glTF. Pilla lo que aquí
falla de verdad — un modelo que flota, uno enterrado, uno mirando al revés, un
id que el mundo busca y el shell no tiene, y una clave de modelo sin archivo ni
constructor detrás (que se dibujaría como nada, sin error).

## Despliegue

`.github/workflows/deploy.yml` corre `lint`, `verify` y `build` en cada push a
`main` y publica `web/out` en GitHub Pages. Requiere que Pages tenga
**GitHub Actions** como *source* en los ajustes del repo.

> **`index.html` en la raíz es la versión antigua**: el juego entero en un solo
> archivo, de antes de la migración. Sigue aquí porque, si Pages todavía sirve
> desde la rama, es lo que hay publicado. Una vez confirmado que Pages va por
> Actions, se borra: `git rm "index.html" && git commit -m "chore: drop the
> single-file build"`.

## Licencia

Código y contenido © Raúl Jiménez Ayza. Los modelos de terceros y sus términos
están en [`web/public/models/CREDITS.md`](web/public/models/CREDITS.md).
