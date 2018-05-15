package com.uniovi.tests;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.uniovi.tests.pageobjects.PO_ListView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PrivateView;
import com.uniovi.tests.pageobjects.PO_Properties;
import com.uniovi.tests.pageobjects.PO_PublicationView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SocialNetworkTests {
	// En Windows (Debe ser la versión 46.0 y desactivar las actualizacioens
	// automáticas)):
//	 static String PathFirefox = "D:\\UNIVERSIDAD\\Segundo Semestre\\SDI\\Sesion 05\\Firefox46.win\\FirefoxPortable.exe";

	
	static String PathFirefox = "Firefox46.win\\FirefoxPortable.exe";

	// Común a Windows y a MACOSX
	public static WebDriver driver = getDriver(PathFirefox);
	static String URL = "http://localhost:8090";

	public static WebDriver getDriver(String PathFirefox) {
		// Firefox (Versión 46.0) sin geckodriver para Selenium 2.x.
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	// Antes de cada prueba se navega al URL home de la aplicaciónn
	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	// Después de cada prueba se borran las cookies del navegador
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	// Antes de la primera prueba
	@BeforeClass
	static public void begin() {
		// navego a la url home ya que se ejecuta antes que el método setup
		driver.navigate().to(URL);
	}

	// Al finalizar la última prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}

	// RegVal. Prueba del formulario de registro. registro con datos correctos
	@Test
	public void P01_1RegVal() {
		// Vamos al formulario de registro
		PO_NavView.clickOption(driver, "signup", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "josefoperez@gmail.com", "Josefo", "Perez", "77777", "77777");
		// Comprobamos que entramos en la sección privada
		// SeleniumUtils.textoPresentePagina(driver, "josefoperez@gmail.com");
		PO_View.checkKey(driver, "users.message", PO_Properties.getSPANISH());
	}

	// RegInval. Prueba del formulario de registro. registro con datos incorrectos
	// (contraseña no igual)
	@Test
	public void P01_2RegInval() {
		// Vamos al formulario de registro
		PO_NavView.clickOption(driver, "signup", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "josefoperez1@gmail.com", "Josefo", "Perez", "77777", "77778");
		// Comprobamos que entramos en la sección privada
		// PO_View.checkKey(driver, "Error.signup.passwordConfirm.coincidence",
		// PO_Properties.getSPANISH());
		SeleniumUtils.textoPresentePagina(driver, "Las contraseñas no coinciden");
	}

	// InVal. Inicio de sesión con datos válidos
	@Test
	public void P02_1InVal() {
		PO_LoginView.fillForm(driver, "prueba1@uniovi.es", "123456");
		/* Comprobamos que se ha iniciado sesion correctmente */
		PO_View.checkElement(driver, "text", "Usuarios");
	}

	// InInVal. Inicio de sesión con datos inválidos (usuario no existente en la
	// aplicación).
	@Test
	public void P02_2InInVal() {
		PO_LoginView.fillForm(driver, "prueba100000@uniovi.es", "111111");
		/* Se muestra el mensaje */
		PO_View.checkElement(driver, "text", "Email o contraseña incorrecto");
	}

	// LisUsrVal. Acceso al listado de usuarios desde un usuario en sesión
	@Test
	public void P03_1LisUsrVal() {
		PO_LoginView.fillForm(driver, "prueba1@uniovi.es", "123456");
		// entramos en la seccion de ver todos los usuarios
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "users-menu");
		elementos.get(0).click();
		List<WebElement> elementos2 = PO_View.checkElement(driver, "id", "allUsers");
		elementos2.get(0).click();
		PO_View.checkElement(driver, "text", "Usuarios");
	}

	// LisUsrInVal. Intento de acceso con URL desde un usuario no identificado al listado
	// de usuarios
	// desde un usuario en sesión. Debe producirse un acceso no permitido a vistas
	// privadas.
	@Test
	public void P03_2LisUsrInVal() {
		driver.get("http://localhost:8090/user/list");
		SeleniumUtils.textoPresentePagina(driver, "Identificate");
	}

	// BusUsrVal. Realizar una búsqueda valida en el listado de usuarios desde un
	// usuario en sesión
	@Test
	public void P04_1BusUsrVal() {
		// Creamos 3 usuarios de nombre similar para despues buscarlos:
		// 1
		PO_NavView.clickOption(driver, "signup", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "zzzzzzzzz@gmail.com", "zzzzzzz", "zzzzzzz", "123456", "123456");
		PO_PrivateView.clickOption(driver, "logout", "text", "Identificate");
		// 2
		PO_NavView.clickOption(driver, "signup", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "zzzzzzzzz2@gmail.com", "zzzzzzz2", "zzzzzzz2", "123456", "123456");
		PO_PrivateView.clickOption(driver, "logout", "text", "Identificate");
		// 3
		PO_NavView.clickOption(driver, "signup", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "zzzzzzzzz3@gmail.com", "zzzzzzz3", "zzzzzzz3", "123456", "123456");
		PO_PrivateView.clickOption(driver, "logout", "text", "Identificate");
		// Nos conectamos con un usuario
		// PO_NavView.clickOption(driver, "login", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin", "admin");
		// buscamos "zzzzzzz", deberian salir 3 usuarios con ese nombre o email
		PO_ListView.search(driver, "zzzzz");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		assertTrue(elementos.size() == 3);
	}

	// BusUsrInVal. Intento de acceso con URL a la búsqueda de usuarios desde un usuario
	// no identificado. Debe producirse un acceso no permitido a vistas privadas
	@Test
	public void P04_2BusUsrInVal() {
		driver.get("http://localhost:8090/user/list?searchText=pepe");
		SeleniumUtils.textoPresentePagina(driver, "Identificate");
	}

	// InvVal. Enviar una invitación de amistad a un usuario de forma valida.
	@Test
	public void P05_1InvVal() {
		PO_LoginView.fillForm(driver, "prueba6@uniovi.es", "123456");
		List<WebElement> boton = PO_View.checkElement(driver, "text", "prueba2@uniovi.es");
		boton.get(0).click();
	}

	// InvInVal. Enviar una invitación de amistad a un usuario al que ya le habíamos
	// invitado la invitación
	// previamente. No debería dejarnos enviar la invitación, se podría ocultar el
	// botón de enviar invitación o
	// notificar que ya había sido enviada previamente.
	@Test
	public void P05_2InvInVal() {
		PO_LoginView.fillForm(driver, "prueba5@uniovi.es", "123456");
		List<WebElement> boton = PO_View.checkElement(driver, "id", "peticion2");
		boton.get(0).click();
		List<WebElement> list = driver.findElements(By.xpath("//*[contains(@id,peticion2)]"));
		assertTrue(list.size() > 0);
	}

	// LisInvVal Listar las invitaciones recibidas por un usuario
	@Test
	public void P06_1LisInvVal() {
		// Accedemos con el usuario creado anteriormente:
		PO_LoginView.fillForm(driver, "josefoperez@gmail.com", "77777");
		// Enviamos una peticion al usuario con email prueba1@uniovi.es
		List<WebElement> boton = PO_View.checkElement(driver, "id", "peticion1");
		boton.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 1);
		PO_PrivateView.clickOption(driver, "logout", "text", "Identificate");
		// entramos con el usuario prueba1@uniovi.es
		PO_LoginView.fillForm(driver, "prueba1@uniovi.es", "123456");
		// vamos a ver las peticiones de amistad
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'users-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'peticion/list')]");
		elementos.get(0).click();
		// SeleniumUtils.esperarSegundos(driver, 1);
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 1);
		// SeleniumUtils.textoPresentePagina(driver, "josefoperez@gmail.com");
	}

	// AcepInvVal Aceptar una invitacion recibida
	@Test
	public void P07_1AcepInvVal() {
		// entramos con el usuario prueba1@uniovi.es
		PO_LoginView.fillForm(driver, "prueba1@uniovi.es", "123456");
		// vamos a ver las peticiones de amistad
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'users-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'peticion/list')]");
		elementos.get(0).click();
		// SeleniumUtils.esperarSegundos(driver, 1);
		// aceptamos la invitacion
		List<WebElement> boton = PO_View.checkElement(driver, "id", "petitionButton2");
		boton.get(0).click();
		// Ahora vamos a comprobar que se añadio el amigo
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'users-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'amigos/list')]");
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "josefoperez@gmail.com");
	}

	// ListAmiVal Listar los amigos de un usuario, realizar la comprobación con una lista que
	// al menos
	// tenga un amigo.
	@Test
	public void P08_1ListAmiVal() {
		// El usuario cuyo mail es prueba1 ya es amigo de josefo
		PO_LoginView.fillForm(driver, "prueba1@uniovi.es", "123456");
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "users-menu");
		elementos.get(0).click();
		List<WebElement> elementos2 = PO_View.checkElement(driver, "id", "friends");
		elementos2.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 1);
	}

	// PubVal Crear una publicación con datos válidos
	@Test
	public void P09_1PubVal() {
		// entramos con un usuario
		PO_LoginView.fillForm(driver, "admin", "admin");
		// entramos en la seccion de crear publicacion del menu de publicaciones
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'publications-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'publicacion/add')]");
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "Título");
		// rellenamos datos
		PO_PublicationView.fillForm(driver, "Hola mundo", "Hola Mundo!! :)");
		// Buscamos texto
		PO_View.checkElement(driver, "text", "Hola mundo");
		SeleniumUtils.textoPresentePagina(driver, "Mis Publicaciones");
	}

	// LisPubVal Acceso al listado de publicaciones desde un usuario en sesión
	@Test
	public void P10_1LisPubVal() {
		// entramos con un usuario
		PO_LoginView.fillForm(driver, "admin", "admin");
		// entramos en la seccion de listar publicaciones del menu de publicaciones
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'publications-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'publicacion/list')]");
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "Título");
		// Buscamos texto
		SeleniumUtils.textoPresentePagina(driver, "Mis Publicaciones");
	}

	// ListPubAmiVal Listar las publicaciones de un usuario amigo
	@Test
	public void P11_1ListPubAmiVal() {
		// Accedemos con el usuario creado anteriormente:
		PO_LoginView.fillForm(driver, "josefoperez@gmail.com", "77777");
		// accedemos a nuestra lista de amigos
		List<WebElement> elementos = PO_View.checkElement(driver, "id", "users-menu");
		elementos.get(0).click();
		List<WebElement> elementos2 = PO_View.checkElement(driver, "id", "friends");
		elementos2.get(0).click();
		List<WebElement> elementos3 = PO_View.checkElement(driver, "text", "Pedro");
		elementos3.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 1);
	}

	// LisPubAmiInVal Utilizando un acceso vía URL tratar de listar las publicaciones de un
	// usuario que
	// no sea amigo del usuario identificado en sesión.
	@Test
	public void P11_2LisPubAmiInVal() {
		// partimos de la base de que el usuario prueba2@uniovi.es tiene una publicacion
		// y no es amigo de josefo
		PO_LoginView.fillForm(driver, "josefoperez@gmail.com", "77777");
		// Intentamos acceder a las publicaciones y no nos saldra ninguna
		driver.get("http://localhost:8090/publicacion/amigo/2");
		// El titulo de la publicacion que tiene es probando
		SeleniumUtils.textoNoPresentePagina(driver, "probando");
	}

	// PubFot1Val Crear una publicación con datos válidos con foto adjunta
	@Test
	public void P12_1PubFot1Val() {
		// entramos con un usuario
		PO_LoginView.fillForm(driver, "admin", "admin");
		// entramos en la seccion de crear publicacion del menu de publicaciones
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'publications-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'publicacion/add')]");
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "Título");
		// rellenamos datos con una foto
		PO_PublicationView.fillFormWithPhoto(driver, "Con foto", "Hola Mundo!! :)", "photo.jpg");
		// Buscamos texto
		PO_View.checkElement(driver, "text", "Con foto");
		SeleniumUtils.textoPresentePagina(driver, "Mis Publicaciones");

	}

	// PubFot2Val Crear una publicación con datos válidos sin foto adjunta
	@Test
	public void P12_2PubFot2Val() {
		// entramos con un usuario
		PO_LoginView.fillForm(driver, "admin", "admin");
		// entramos en la seccion de crear publicacion del menu de publicaciones
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'publications-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'publicacion/add')]");
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "Título");
		// rellenamos datos
		PO_PublicationView.fillForm(driver, "Sin foto", "Hola Mundo!! :)");
		// Buscamos texto
		PO_View.checkElement(driver, "text", "Sin foto");
		SeleniumUtils.textoPresentePagina(driver, "Mis Publicaciones");
	}

	// AdInVal Inicio de sesión como administrador con datos válidos.
	@Test
	public void P13_1AdInVal() {
		PO_LoginView.fillForm(driver, "admin", "admin");
		PO_View.checkElement(driver, "text", "Usuarios");
	}

	// AdInInVal Inicio de sesión como administrador con datos inválidos (usar los
	// datos de un usuario
	// que no tenga perfil administrador).
	@Test
	public void P13_2AdInInVal() {
		PO_NavView.clickOption(driver, "admin/login", "text", "Acceso Administrador");
		PO_LoginView.fillForm(driver, "prueba1@uniovi.es", "123456");

		SeleniumUtils.textoPresentePagina(driver,
				"Identificate");

	}

	// AdLisUsrVal Desde un usuario identificado en sesión como administrador listar a
	// todos los usuarios de la aplicación
	@Test
	public void P14_1AdLisUsrVal() {
		// entramos con un administrador
		PO_LoginView.fillForm(driver, "admin", "admin");
		// entramos en la seccion de listar usuarios de la consola de administracion
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'admin-menu')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'user/list')]");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 1);
		// Buscamos texto
		SeleniumUtils.textoPresentePagina(driver, "Usuarios");
	}

}
