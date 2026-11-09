# MateRico · maqueta funcional

Maqueta navegable de **MateRico**, la plataforma web tipo juego de tablero para que estudiantes de 10.° y 11.° refuercen matemáticas. Esta entrega sirve para **mostrar avances y validar la dirección visual y el flujo del juego**; no es todavía el MVP con backend.

> Documentación de diseño: `../MateRico - Boveda/` (Obsidian).
> Código: esta carpeta (`materico/`).

## Qué incluye

- **Landing** con la identidad visual, los seis barrios y el alcance de la maqueta.
- **Demo del estudiante** (`/play`) jugable de punta a punta:
  - dado de 1 a 4 y movimiento por el tablero;
  - retos con temporizador, opción única, respuesta numérica y fracción;
  - acierto: conserva la casilla, gana monedas y adquiere la propiedad;
  - fallo o tiempo agotado: vuelve al inicio del turno;
  - casilla de **banco** (25 monedas seguras o doble o nada);
  - casilla de **evento** (subsidio, inflación, auditoría, feria);
  - **punto de control** de 3 retos, aprueba 2 y pasa al siguiente barrio;
  - progreso guardado en `localStorage` y opción de reiniciar.
- **Panel docente** (`/teacher`) con datos ficticios:
  - KPIs del curso, actividad semanal y dominio por habilidad;
  - distribución de estudiantes por barrio;
  - señales de anomalía para revisión (nunca sanción automática);
  - tabla de estudiantes con búsqueda y filtros por estado.
- **22 plantillas paramétricas** agrupadas en los seis barrios, con distractores y explicación paso a paso.
- Accesibilidad base: foco visible, navegación por teclado, texto además de color, `aria-live`, y respeto a `prefers-reduced-motion`.
- Las tres pantallas obtienen **100/100 en la auditoría de accesibilidad de Lighthouse**.

## Stack de la maqueta

| Pieza | Versión |
|---|---|
| Next.js (App Router, Turbopack) | 16.4.6 |
| React / React DOM | 19.3.1 |
| TypeScript | 5.9 |
| Tailwind CSS | 4.3.5 |
| KaTeX | 0.19.1 |
| lucide-react | 1.70.0 |
| pnpm (workspace) | 12.3.4 |
| Node.js | 22 LTS |

El monorepo queda preparado para crecer a `apps/web`, `apps/api`, `packages/contracts`, `packages/question-engine` y `packages/ui-tokens`, según la bóveda.

## Cómo ejecutarla

Requisitos: Node.js 22 LTS y pnpm 12.

```bash
pnpm install
pnpm dev
```

Abre <http://localhost:3000>.

Otros comandos:

```bash
pnpm build   # build de producción
pnpm lint    # ESLint + reglas de React
```

## Ejecutar con Docker

Requisitos: Docker 24+ con Compose v2. No hace falta Node ni pnpm en la máquina.

```bash
docker compose up --build
```

Abre <http://localhost:3000>. Para detenerlo:

```bash
docker compose down
```

Si el puerto 3000 está ocupado (por ejemplo, por `pnpm dev`), usa otro puerto del host:

```bash
# PowerShell
$env:WEB_PORT=3100; docker compose up --build
# Bash
WEB_PORT=3100 docker compose up --build
```

También puedes construir y ejecutar la imagen sin Compose:

```bash
docker build -t materico-web .
docker run --rm -p 3000:3000 materico-web
```

### Qué hace la imagen

- **Multi-stage**: instala dependencias con pnpm y `--frozen-lockfile`, compila Next.js y solo copia el servidor `standalone` a la imagen final.
- **Usuario no-root** (`nextjs:nodejs`) y sin capacidades extra.
- **Healthcheck** contra `/` cada 30 s; Compose lo muestra como `healthy`.
- **Puerto interno 3000**; el host se controla con `WEB_PORT`.
- El build usa caché de BuildKit para el store de pnpm, así que las siguientes construcciones son más rápidas.

> La maqueta no necesita variables de entorno ni base de datos. En el MVP, los secretos se inyectarán en tiempo de ejecución y nunca se copiarán dentro de la imagen.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Landing de la maqueta |
| `/play` | Demo jugable del estudiante |
| `/teacher` | Panel docente con datos ficticios |

## Guion de demostración (5–7 minutos)

1. **Landing.** Presenta el concepto «una ciudad que se construye con matemáticas», los seis barrios y la nota de alcance.
2. **Jugar demo.** Lanza el dado. Muestra cómo la ficha avanza y cómo cambia el turno.
3. **Reto.** Resuelve una pregunta. Enseña el temporizador, la respuesta correcta y la explicación.
4. **Fallo.** Fuerza una respuesta incorrecta y muestra cómo la ficha vuelve al inicio del turno.
5. **Banco y evento.** Cae en la casilla de banco (cobra 25 o arriesga 50) y en la de evento (monedas o racha).
6. **Punto de control.** Responde 3 retos, aprueba 2 y muestra el paso al siguiente barrio y las +50 monedas.
7. **Panel docente.** Muestra el avance del curso, el dominio por habilidad y las señales de anomalía.
8. **Reiniciar.** Vuelve a jugar y observa que los valores y el orden de las opciones cambian.

Consejo para la demo: usa el botón **Reiniciar** antes de empezar para limpiar el progreso guardado.

## Maqueta vs. MVP

| Aspecto | Maqueta (hoy) | MVP (siguiente) |
|---|---|---|
| Dado y movimiento | Simulados en el navegador | Servidor autoritativo |
| Calificación | En el navegador (la respuesta viaja al cliente) | Solo servidor; la respuesta nunca llega al navegador |
| Preguntas | Plantillas paramétricas en el cliente | Plantillas en `question-engine`, semilla secreta y exclusión de vistas recientes |
| Progreso | `localStorage` | PostgreSQL + Redis para sesiones y límites |
| Identidad | Estudiante demo | Registro con código de curso, sesiones y roles |
| Panel docente | Datos ficticios | Reportes reales con autorización por curso |
| Tiempo | Reloj del navegador | Hora del servidor |
| Accesibilidad | Revisada con Lighthouse | E2E + axe en CI, WCAG 2.2 AA |

> **Importante:** esta maqueta guarda `correctOptionId` y `correctValue` en `localStorage` para poder calificar sin backend. Eso es aceptable para demostrar la experiencia, pero **no es seguro para producción**. El MVP debe aplicar el ADR-004 (servidor autoritativo) y las pruebas de contrato de la bóveda.

## Estructura

```text
materico/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx        # fuentes, KaTeX y estilos globales
│       │   ├── page.tsx          # landing
│       │   ├── play/             # demo del estudiante
│       │   └── teacher/          # panel docente
│       ├── components/           # tablero, modales, tarjetas y panel
│       └── lib/
│           ├── game-data.ts      # barrios, casillas, habilidades y eventos
│           ├── game-state.ts     # estado y fases del juego
│           ├── questions.ts      # 22 plantillas paramétricas y verificación
│           └── teacher-data.ts   # datos ficticios del panel
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── Dockerfile              # imagen multi-stage de producción
├── docker-compose.yml      # servicio web + healthcheck
├── .dockerignore
└── README.md
```

## Próximos pasos sugeridos

1. Validar con el docente la dirección visual, el guion de demo y la conexión con Investigación de Operaciones.
2. Planificar los sprints del MVP a partir de `09 Plan/Roadmap.md`.
3. Sprint 0: completar el monorepo con `apps/api`, `packages/contracts` y `packages/question-engine`.
4. Migrar las plantillas al motor puro y añadir pruebas de propiedades.
5. Implementar identidad, sesiones en Redis, PostgreSQL y el turno autoritativo.
6. Sustituir los datos ficticios del panel docente por reportes reales.

## Créditos

Maqueta desarrollada para el último parcial de **Investigación de Operaciones** · Ingeniería en Sistemas.
Contenido alineado con los DBA de Matemáticas 10.°–11.° y el marco de referencia de Saber 11.
Todos los nombres, métricas y datos de la demo son ficticios.
