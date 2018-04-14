# Node-SocialNetwork

## Aspecto Generales
### Seguridad
Deberán tenerse en cuenta los siguientes aspectos de seguridad:
+ Emplear la técnica de autentificación/autorización más adecuada a este contexto.
+ En caso necesario comprobar el permiso de cada usuario para acceder a las URL o recursos
solicitados.
+ Registrar el acceso de los usuarios y la actividad en un Logger (por ejemplo log4js ).
### Arquitectura
La aplicación deberá estar obligatoriamente diseñada siguiente el patrón arquitectónico visto en clase. La
utilización incorrecta de elementos de esta arquitectura será fuertemente penalizada (por ejemplo,
implementar parte de la lógica de negocio de la aplicación en un controlador, acceder a un repositorio
desde un controlador, configurar una vista desde un servicio, etc.).
Los servicios web REST deben seguir la arquitectura RESTful , se deben utilizar URLs y métodos Http
adecuados en cada caso
### Otros aspectos que serán evaluados
+ Claridad y calidad de la implementación del código JavaScript
+ Calidad de la implementación de las vistas y usando todas las funcionalidades vistas en clase.
## Entrega
A cada equipo de trabajo se asignará un número n en el campus virtual. Según ese numero se deberá
crear los proyectos eclipse de la aplicación web primefaces y las pruebas unitarias con los nombres sdi2-
n y sdi2-test-n respectivamente (ambos en minúsculas). Se deberá subir a la tarea correspondiente un
archivo ZIP (usando el formato ZIP) con el nombre sdi2-n.zip (en minúsculas) y que deberá contener en
su raíz:
+ Un documento PDF (con el mismo nombre que el proyecto sdi2-n.pdf) que contenga:
+ + Una descripción clara y detallada de la implementación de cada uno de los casos de uso
implementados.
+ + Un catálogo de las pruebas unitarias realizadas y descripción sencilla de cada una
+ + Cualquier otra información necesaria para una descripción razonablemente detallada de lo
entregado y su correcto despliegue y ejecución.
+ El proyecto Node en formato carpeta (no comprimido) con el nombre .\sdi2-n
+ El proyecto Java eclipse con los casos de prueba en formato carpeta (no comprimido) con el
nombre .\sdi2-test-n
+ En resumen, el zip deberá contener en su raíz:
+ + sdi2-n.pdf
+ + sdi2-n
+ + sdi2-test-n
## Fecha máxima de entrega
La fecha de entrega será dependiente del grupo de laboratorio, coincidiendo con 6 días DESPUES de a
la impartición de la práctica 11 en el el grupo al que pertenece el alumno, la hora límite serán las 20:00.
Por ejemplo, el grupo del L1 del Miércoles, tiene la práctica 11 el 25/04 por lo tanto deberá entregar el:
30/04 a las 20:00
## Evaluación
Se penalizará:
+ Que se presenten problemas durante el despliegue.
