# Babel Life: instrucciones para Claude

Babel Life es un sitio estático (TypeScript sin framework, Vite, CSS) en dos ediciones, inglés en `/` y castellano en `/es/`, publicado en Netlify. El propietario es Rolando.

**Fuente de verdad: `docs/BLUEPRINT.md`.** Arquitectura, reglas editoriales (sección 3), mapa editorial congelado (sección 4), lo que no se implementa (sección 5) y el estado (sección 6). Léelo antes de tocar nada; este fichero no lo repite. La edición castellana sigue además `docs/translation-guide-es.md`.

## Cómo quiere trabajar Rolando

- **Informe en castellano**, aunque el encargo venga en inglés. Tono directo, sin halagos ni cierres de ofrecimiento. Informe final numerado.
- **Alcance estricto.** Haz lo que nombra el encargo y nada más. Si ves algo fuera de alcance, menciónalo en el informe; no lo arregles.
- Si el encargo admite varias lecturas razonables, preséntalas y pregunta. No elijas en silencio.
- Trabaja en Windows y escribe los encargos con `npm.cmd`: aquí se ejecutan las mismas órdenes con `npm`, sin preguntar.
- **Sus encargos citan a veces ramas o SHA que solo existen en su máquina.** Haz `git fetch`, comprueba qué hay de verdad en el remoto, trabaja sobre la cabeza real, díselo en la primera línea del informe y mantén el diff limitado a los ficheros de la tarea para que aplique sobre su rama local.
- Hay otras sesiones (suyas o de Claude) que empujan a `main`. Antes de empezar, `git fetch` y mira `origin/main`; el Blueprint puede haber cambiado sin que él lo diga.

## Commits, push y publicación

- **Netlify despliega en continuo desde `main`: un push a `main`, o el merge de un PR a `main`, publica en vivo.** Netlify ejecuta `npm run verify` (`netlify.toml`): typecheck, tests y build.
- **No hagas commit ni push hasta que él lo autorice.** Suele autorizar en un mensaje aparte, con la rama, los ficheros y a veces el mensaje de commit literal.
- **Un commit por trabajo.** Los arreglos de fallos van aparte del trabajo visual, y cada pasada independiente en su propio commit.
- **Un push autorizado cubre solo el trabajo que nombra.** Si hay commits locales sin autorizar, monta el autorizado sobre `origin/main` y empuja solo ese.
- **Antes de cada push a `main`, comprueba que el remoto no ha avanzado.**
- Si el push directo a `main` falla desde una sesión en la nube, la vía que ya se usó es un PR desde la rama de la sesión, fusionado con *rebase* para conservar los commits, y solo con su autorización.
- Mensajes de commit en inglés, estilo Conventional Commits (`feat:`, `fix:`, `style:`, `copy(es):`, `docs(blueprint):`, `chore:`), en imperativo y diciendo lo que cambia para el lector: `fix: reorder the five pinned opening roots`.
- El contenedor de una sesión en la nube es efímero. Si el trabajo termina sin autorización para commitear, díselo claramente: lo que no llega al remoto se pierde.

## Verificación

- `npm test` (Vitest, con jsdom en las vistas), `npm run typecheck` y `npm run build`. `npm run verify` hace los tres. Node 22.
- Netlify ejecuta `npm run verify`, así que un test en rojo para el despliegue igual que un error de tipos o un build roto. `npm run build` por sí solo **no** ejecuta los tests.
- Un test que choca con una decisión editorial nueva se cambia; el texto no se retuerce para pasar un test viejo. Los límites editoriales se mueven primero en el Blueprint.
- **Verificación visual económica.** Un conjunto pequeño y representativo (1440, 1024–1280 y 390 px), sin tests de píxeles y sin capturas no esenciales salvo que encuentres una regresión real. El peso va en `npm test`, typecheck y build.
- Para ver la web en local: `npm run build && npm run preview`.

## El Blueprint

- **Lo escriben los dos; no es una restricción heredada.** No te pares ante él: si el trabajo lo contradice, propón la edición como diff y espera su aprobación. **Nunca lo edites en silencio.**
- **Qué va en él:** reglas estables del sistema, arquitectónicas y editoriales. Sus palabras: «No quiero que el Blueprint se convierta en un inventario de iconos ni en documentación de detalles gráficos concretos». Nada de píxeles, disposición de baldas, CSS ni geometría responsive salvo que sean invariantes reales.
- Con el trabajo visual prefiere verlo desplegado antes de decidir si se documenta y cómo.
- Si te llega un patch del Blueprint ya preparado, revísalo contra estas reglas y ajústalo lo mínimo si no las cumple.
- `tests/blueprint.test.ts` contrasta el mapa de la sección 4 (TITLE, WALL HOOK, NEARBY A/B y el inventario) con el catálogo. Las cifras 27/54/81 solo viven en ese inventario.

## Criterio de diseño

- **«Elegancia editorial antes que interacción por interacción.»** «Elegant first, charming second.»
- Relevancia conceptual antes que ingenio decorativo; mejor ajuste semántico, no novedad por sí misma. Nada que haga el sitio más mono, más cargado o más caricaturesco.
- Fracasa si parece un sitemap, una rejilla de progreso, un dashboard, un lanzador de apps o una demo de CSS.
- Las cifras de escala del hero no son controles: sin `tabindex`.

## Modelo conceptual y terminología (regla fija)

- **Una vida completa es un libro.** El raíz contiene una vida completa y cada cercano contiene **otra** vida completa.
- Raíz más dos cercanos es una **familia narrativa**, y **nunca se llama «vida»**. Definir una vida como la familia de tres libros es un error que él ya corrigió una vez.
- «Volumen» queda para el objeto físico y la coordenada.
- N familias, N raíces en el muro, 2N cercanos, 3N libros o vidas completas.
- En castellano el muro es **«Muro de vidas»** («Wall of Lives» en inglés). «Pared 1–4» es la terminología física de las coordenadas.

## Reglas editoriales que ya decidió

Están en la sección 3 del Blueprint. Las que más se rompen sin querer:

- Cada premisa expone una consecuencia de variación, contingencia, identidad o posibilidad combinatoria. La especificidad concreta vale si afila la idea y debe ser exacta. Nada de misterio vago ni de números inventados. «La escala es el asunto» **no** es regla universal.
- Guardarraíl de 30–110 palabras, independiente en cada edición. **Sin paridad de longitud entre inglés y castellano:** son ediciones literarias nativas, no traducciones. La paridad estructural (mismas accesiones, orden y aristas) sí es invariante.
- Capitalización del catálogo tal como está publicada.
- Lo que inquieta aquí es la implicación y la cercanía al lector. La versión barata de «perturbador» (sobresalto, crueldad) rompe el registro.

## El muro

- **El muro enseña solo las raíces, nunca los 81 libros.**
- **Las cinco raíces clavadas** (`PINNED_ROOT_IDS`, en este orden) son `b0041` (El tuyo / Your Book), `b0010` (Antes de ti / Before You), `b0074` (Cada persona viva / Every Living Person), `b0047` (Cada asiento / Every Seat) y `b0038` (Por donde pasaste / Where You Went). **Solo se tocan por orden suya.** El orden es una entrada progresiva: tu vida exacta; las de tus padres antes de ti; cada persona viva con quien pudiste compartir una vida; la permutación más oscura (el avión y la muerte); las diferencias espaciales mínimas de lo cotidiano.
- Reparto: la vista inicial son las 5 clavadas más 7 barajadas; SHOW ME SOMETHING STRANGER / MOSTRARME ALGO MÁS EXTRAÑO enseña las restantes; SHOW ALL 27 / MOSTRAR LAS 27 enseña todas. Abrir el muro nunca mueve una carta ya vista. Hay tests del reparto, del orden de las clavadas, del recuento y del anuncio accesible.
- **Contadores derivados, no fijos.** El recuento visible, su total y el anuncio del botón de lo extraño salen del catálogo (`TOTAL_ROOTS`, `countWords` por edición). Un test falla si una plantilla vuelve a llevar la cifra escrita. En sus palabras: «No quiero otro número fijo que pueda desfasarse en el futuro».
- **Alcance de esa regla:** solo los contadores del muro. No conviertas en dinámico ningún otro número narrativo. Siguen literales, y hay que tocarlos a mano si cambian las raíces: la etiqueta SHOW ALL 27 / MOSTRAR LAS 27, su anuncio accesible («All twenty-seven lives.» / «Las veintisiete vidas.») y la presentación de `index.html` y `es/index.html`.

## Índice del hero

- Es **el estante de esta edición**: un lomo por libro, cada familia junta con la raíz entre sus dos cercanos. La raíz se distingue; los cercanos son libros completos, no marcas menores.
- Lomos y cifras salen del catálogo, nunca como literales.
- La agrupación es editorial y **nunca implica vecindad física** en la Biblioteca. La coordenada impresa debajo es la dirección real del libro señalado.
- Tiene que leerse sin explicación como «familias → libros completos».

## Página ilegible

- La página física canónica son **3.200 posiciones**. La app muestra un **extracto determinista de 1.280 símbolos** por dirección (`VISIBLE_EXCERPT_LENGTH`). **No se cambia para arreglar maquetación**, y las matemáticas de la Biblioteca no se tocan.
- La hoja es 3:4 en todos los anchos. En móvil se ve lo que cabe, con una máscara que funde las últimas líneas: sin scroll interno, sin «ver más» y sin reducir la letra. El extracto sigue entero en el DOM con `aria-hidden`.

## Motivos: carboncillo y sanguina

- Cada libro tiene un motivo que dice su premisa (`src/views/illustrations.ts`, `motifs.ts`). El campo `icon` es el mismo en EN y ES.
- **Criterio para cambiar motivos:** conservar lo que ya dice la premisa y cambiar solo lo genérico, heredado o sin relación, en el mismo lenguaje visual. Nada de símbolos genéricos repetidos sin significado.
- Todos los motivos pasan por un único filtro de carboncillo (`charcoal-hand`) en tinta `--charcoal`.
- **Regla de la sanguina** (`--sanguine`, mapa por libro en `ACCENTS` de `illustrations.ts`, sin tocar catálogos; test en `tests/accents.test.ts`): en la raíz marca su **punto de contingencia**, dónde podría cambiar la vida; en el cercano marca **lo que cambió**. Nunca repite en la raíz el trazo de uno de sus cercanos. Un cercano sin sanguina es deliberado cuando cambia todo o cuando el dibujo muestra lo que se mantiene.
- **No se tiñen todos los motivos:** él lo planteó y aceptó que sería adorno. El color tiene que significar algo.

## Descartado por él

No lo propongas de nuevo salvo que lo saque él:

- Un contador de consultas por volumen con Blobs y su ranking semanal.
- Que SHOW ME SOMETHING STRANGER escale por un eje de cercanía.
