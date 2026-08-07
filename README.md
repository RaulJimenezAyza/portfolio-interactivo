# La Isla del Gato — portfolio jugable 3D

Portfolio de **Raúl Jiménez Ayza** (gameplay & fullstack dev) como juego 3D:
una isla con relieve, ocho templos que cuentan su CV, físicas reales, doce
peces dorados escondidos y un minijuego de Mastermind.

▶ **[Jugar](https://rauljimenezayza.github.io/portfolio-interactivo/)**

## Qué hay dentro

- Isla generada por heightmap: colinas, cresta central y costa irregular con playas.
- Ocho zonas, una por sección del CV, cada una con su propia arquitectura y lore.
- Física con cannon-es: cajas empujables, bolos, dominós, balancín y rampas.
- Gato con squash & stretch, doble salto, cola articulada y pose de sentado.
- Audio sintetizado en tiempo real: música generativa con una paleta distinta
  por templo, ambiente de mar y viento, y efectos por oscilador. Sin archivos.
- Minijuego de Mastermind en las Ruinas del Enigma que desbloquea el altar.
- Cueva de cristal bajo la isla con un arcade de cuatro máquinas: Pong, un
  Snake temático, un Simon de runas y el propio Mastermind, con récords guardados.
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

Todo el juego es **un único `index.html` sin dependencias externas**: three.js,
cannon-es y los post-procesos van embebidos, y las texturas, la geometría y el
sonido se generan en tiempo de ejecución. Solo necesita un navegador con WebGL.

Para trabajar en él basta con abrirlo, aunque los tipos de letra vienen de Google
Fonts, así que conviene servirlo por HTTP en local:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Licencia

Código y contenido © Raúl Jiménez Ayza.
