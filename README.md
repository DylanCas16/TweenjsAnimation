# TweenjsAnimation

Se ha implementado un videojuego de navegador que utiliza Ammojs-typed.

## Estructura del proyecto

### Fisicas `Ammo`

Toda la lógica de las físicas y las balas se encuentra en el fichero `ammo_logic.js`. En él se encuentra una implementación básica extraída del siguiente repositorio de , las funciones que se implementaron fueron:

- `initPhysics()`. Esta activa la posibilidad de añadir colisiones, así como una gravedad en forma de velocidad constante que tira hacia abajo.

- `createRigidBody()`. Se trata de una función auxiliar que ayuda a la siguiente función a añadirle propiedades rígidas a los cubos con las posiciones pasadas en los parámetros.

- `createBoxWithPhysics()`. Crea un caja con `Three` y le añade las físicas de la librería `Ammo` apoyándose de la anterior función.

- `initInput()`. En esta función se implementa toda la lógica de las balas. Estas se generan al pulsar cualquiera de los clics del ratón y se disparan desde la posición de la cámara en la dirección que esté apuntando el cursor.

- `clearDynamicBodies()`. Se trata de una función auxiliar que regenera los bloques en los distintos niveles o al reiniciar.

- `updatePhysics()`. Actualiza las físicas en función del tiempo.

También se implementa la fricción y la inercia para las balas y los bloques que hay que derribar.

### Creación de niveles

La creación de los niveles ocurre en el fichero `level_generator.js`. Está formada por una serie de funciones que describe distintas estructuras, las cuales se utilizarán para diseñar cada nivel. Existe un total de tres niveles en las funciones `generateLevelX()` y las estructuras disponibles son:

- `createBlock()`. Es la función más nuclear y genera un único cubo, con sombra y físicas. Esta función se encuentra en las siguientes estructuras más complejas.

- `createWall()`. Genera un muro de un bloque de profundidad. Se puede elegir la altura (`columns`) y anchura (`rows`), así como el tamaño de los bloques (`blockSize`).

- `createTower()`. Crea una torre de altura (`height`) y tamaño de bloques (`blockSize`) a elegir. Está formada por una columna de bloques apilados.

- `createPyramid()`. Forma una pirámide a partir de bloques, se puede seleccionar el nivel de altura (`levels`) y el tamaño de bloques (`blockSize`).

### Puesta en marcha

El fichero `script.js` recoge todas estas funcionalidades y genera el videojuego. 

Se encarga de generar el mapa en al función `createGround()`, siendo este un suelo con tres plataformas. 

Además, se genera un selector de niveles para poder ir al deseado en cualquier momento junto con un botón de reiniciar en la función `initUI()`. Por defecto, se genera primero el "nivel 1". Cabe mencionar que no existe un objetivo ni dificultad entre los niveles, simplemente genera estructuras en distintas posiciones para probar y divertirse.

Finalmente, la cámara está bloqueada para proponer un mínimo de reto al tener que apuntar desde una distancia considerable a los bloques.

A continuación, se compartirá un enlace al siguietne [vídeo demo](https://youtu.be/rt5uDSykAHQ).

## Bibliografía

Plantilla base para la implementación de físicas y mundo: [GitHub](https://github.com/otsedom/otsedom.github.io/blob/main/IG/S11/code/script_45_ammo.js)

## Uso de la IA

La IA se utilizó para la corrección de varios errores al repartir las dependencias entre los ficheros, así como para la implementación del botón y selector de niveles.
