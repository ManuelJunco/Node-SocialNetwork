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
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.uniovi.tests.pageobjects.PO_HomeView;
import com.uniovi.tests.pageobjects.PO_ListView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_MessageView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SocialNetworkTests {
	// En Windows (Debe ser la versión 46.0 y desactivar las actualizacioens
	// automáticas)):
	 //static String PathFirefox = "D:\\UNIVERSIDAD\\Segundo Semestre\\SDI\\Sesion 05\\Firefox46.win\\FirefoxPortable.exe";

	private String email;
	static String PathFirefox = "Firefox46.win\\FirefoxPortable.exe";

	// Común a Windows y a MACOSX
	public static WebDriver driver = getDriver(PathFirefox);
	static String URL = "http://localhost:8081";

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
		//borramos base de datos
		driver.navigate().to("http://localhost:8081/borrarBD");
		//metemos datos
		driver.navigate().to("http://localhost:8081/crearUsuarios");
		driver.navigate().to("http://localhost:8081/establecerAmistades");
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
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		int num = 0 + (int) (Math.random() * ((10000 - 0) + 1));
		email = "josefoperez" + num + "@gmail.com";
		PO_RegisterView.fillForm(driver, email, "Josefo", "123456789", "123456789");
		// Comprobamos que redirecciona al login
		SeleniumUtils.textoPresentePagina(driver, "Identificación");


	}

	// RegInval. Prueba del formulario de registro. registro con datos incorrectos
	// (contraseña no igual)
	@Test
	public void P01_2RegInval() {
		// Vamos al formulario de registro
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		// Rellenamos el formulario.
		PO_RegisterView.fillForm(driver, "josefoperez1@gmail.com", "Josefo", "123456789", "123456788");
		SeleniumUtils.textoPresentePagina(driver, "La password y su confirmación deben ser iguales");
	}

	// InVal. Inicio de sesión con datos válidos
	@Test
	public void P02_1InVal() {
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		/* Comprobamos que se ha iniciado sesion correctmente */
		PO_View.checkElement(driver, "text", "usuarios");
	}

	// InInVal. Inicio de sesión con datos inválidos (usuario no existente en la
	// aplicación).
	@Test
	public void P02_2InInVal() {
		PO_LoginView.fillForm(driver, "prueba100000@uniovi.es", "111111");
		/* Se muestra el mensaje */
		PO_View.checkElement(driver, "text", "Email o password incorrecto");
	}

	// LisUsrVal. Acceso al listado de usuarios desde un usuario en sesión
	@Test
	public void P03_1LisUsrVal() {
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		// entramos en la seccion de ver todos los usuarios
		PO_View.checkElement(driver, "text", "usuarios");
	}

	// LisUsrInVal. Intento de acceso con URL desde un usuario no identificado al
	// listado
	// de usuarios
	// desde un usuario en sesión. Debe producirse un acceso no permitido a vistas
	// privadas.
	@Test
	public void P03_2LisUsrInVal() {
		driver.get("http://localhost:8081/usuario");
		SeleniumUtils.textoPresentePagina(driver, "Identificación");
	}

	// BusUsrVal. Realizar una búsqueda valida en el listado de usuarios desde un
	// usuario en sesión
	@Test
	public void P04_1BusUsrVal() {
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		// buscamos "zzzzzzz", deberian salir 3 usuarios con ese nombre o email
		PO_ListView.search(driver, "prueba2");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				PO_View.getTimeout());
		assertTrue(elementos.size() == 1);
	}

	// BusUsrInVal. Intento de acceso con URL a la búsqueda de usuarios desde un
	// usuario
	// no identificado. Debe producirse un acceso no permitido a vistas privadas
	@Test
	public void P04_2BusUsrInVal() {
		driver.get("http://localhost:8081/usuario?busqueda=prueba2");
		SeleniumUtils.textoPresentePagina(driver, "Identificación");
	}

	// InvVal. Enviar una invitación de amistad a un usuario de forma valida.
	@Test
	public void P05_1InvVal() {
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		List<WebElement> boton = PO_View.checkElement(driver, "id", "prueba4@prueba4.com");
		boton.get(0).click();
		SeleniumUtils.textoPresentePagina(driver, "Petición enviada con éxito");
	}

	// InvInVal. Enviar una invitación de amistad a un usuario al que ya le habíamos
	// invitado la invitación
	// previamente. No debería dejarnos enviar la invitación, se podría ocultar el
	// botón de enviar invitación o
	// notificar que ya había sido enviada previamente.
	@Test
	public void P05_2InvInVal() {
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		List<WebElement> boton = PO_View.checkElement(driver, "id", "prueba4@prueba4.com");
		boton.get(0).click();
		SeleniumUtils.textoPresentePagina(driver,
				"Esta petición ya ha sido enviada o quizás deberías ver tu lista de peticiones recibidas");
	}

	// LisInvVal Listar las invitaciones recibidas por un usuario
	@Test
	public void P06_1LisInvVal() {
		// Accedemos con el usuario creado anteriormente:
		PO_LoginView.fillForm(driver, "prueba4@prueba4.com", "prueba4");

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'listaInvitaciones')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'invitaciones')]");
		elementos.get(0).click();
		// SeleniumUtils.esperarSegundos(driver, 1);
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() == 1);
		// SeleniumUtils.textoPresentePagina(driver, "josefoperez@gmail.com");
	}

	// AcepInvVal Aceptar una invitacion recibida
	@Test
	public void P07_1AcepInvVal() {
		// Accedemos con el usuario creado anteriormente:
		PO_LoginView.fillForm(driver, "prueba4@prueba4.com", "prueba4");

		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'listaInvitaciones')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'invitaciones')]");
		elementos.get(0).click();
		// aceptamos la invitacion
		List<WebElement> boton = PO_View.checkElement(driver, "id", "prueba1");
		boton.get(0).click();
		// Ahora vamos a comprobar que se añadio el amigo
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'listaAmigos')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'amigo')]");
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "prueba1@prueba1.com");
	}

	// ListAmiVal Listar los amigos de un usuario, realizar la comprobación con una
	// lista que
	// al menos
	// tenga un amigo.
	@Test
	public void P08_1ListAmiVal() {
		// El usuario cuyo mail es prueba1 ya es amigo
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id, 'listaAmigos')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'amigo')]");
		elementos.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", PO_View.getTimeout());
		assertTrue(elementos.size() >= 3);
	}

	// CInVal Inicio de sesión con datos válidos
	@Test
	public void PRC1_1CInVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		PO_LoginView.checkElement(driver, "text", "Bienvenido");
	}

	// CInInVal Inicio de sesión con datos inválidos (usuario no existente en
	// la aplicación).
	@Test
	public void PRC1_2CInInVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "pedro@uniovi.es", "123456789");
		PO_LoginView.checkElement(driver, "text", "Usuario no encontrado. Usuario o email incorrectos.");
	}

	// CListAmiVal Acceder a la lista de amigos de un usuario, que al menos
	// tenga tres amigos.
	@Test
	public void PRC2_1CListAmiVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		PO_LoginView.checkElement(driver, "text", "Bienvenido");
		// Contamos que tiene 3 amigos
		List<WebElement> filas = PO_View.checkElement(driver, "free", "//tbody/tr");
		assertTrue(filas.size() >= 3);
	}

	// CListAmiFil Acceder a la lista de amigos de un usuario, y realizar un
	// filtrado para encontrar a un
	// amigo concreto, el nombre a buscar debe coincidir con el de un amigo.
	@Test
	public void PRC2_2CListAmiFil() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		PO_LoginView.checkElement(driver, "text", "Bienvenido");
		PO_ListView.search(driver, "prueba2");
		SeleniumUtils.textoPresentePagina(driver, "prueba2");
	}

	// CListMenVal Acceder a la lista de mensajes de un amigo “chat”, la
	// lista debe contener al menos
	// tres mensajes.
	@Test
	public void PRC3_1CListMenVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		PO_LoginView.checkElement(driver, "text", "Bienvenido");
		SeleniumUtils.esperarSegundos(driver, 2);
		SeleniumUtils.textoPresentePagina(driver, "prueba2");
		List<WebElement> elementos = PO_View.checkElement(driver, "text", "prueba2");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		// Enviamos 3 mensajes
		PO_MessageView.sendMessage(driver, "Hola");
		PO_MessageView.sendMessage(driver, "Caracola");
		PO_MessageView.sendMessage(driver, "No me dejes en leido :(");
		SeleniumUtils.esperarSegundos(driver, 2);
		// Comprobamos que hay 3 mensajes
		List<WebElement> mensajes = PO_View.checkElement(driver, "free", "//tbody/tr");
		assertTrue(mensajes.size() == 3);
	}

	// CCrearMenVal Acceder a la lista de mensajes de un amigo “chat” y crear
	// un nuevo mensaje,
	// validar que el mensaje aparece en la lista de mensajes.
	@Test
	public void PRC4_1CCrearMenVal() {
		driver.navigate().to("http://localhost:8081/cliente.html");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		PO_LoginView.checkElement(driver, "text", "Bienvenido");
		SeleniumUtils.esperarSegundos(driver, 3);
		SeleniumUtils.textoPresentePagina(driver, "prueba2");
		List<WebElement> elementos = PO_View.checkElement(driver, "text", "prueba2");
		elementos.get(0).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		//Enviamos nuevo mensaje
		PO_MessageView.sendMessage(driver, "Adios");
		//comprobamos que aparece el nuevo mensaje
		PO_View.checkElement(driver, "text", "Adios");

	}
}
