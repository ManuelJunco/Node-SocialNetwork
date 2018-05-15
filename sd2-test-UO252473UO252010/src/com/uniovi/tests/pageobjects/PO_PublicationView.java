package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_PublicationView extends PO_NavView{

	public static void fillForm(WebDriver driver, String titulo, String texto) {
		WebElement title = driver.findElement(By.name("title"));
		title.click();
		title.clear();
		title.sendKeys(titulo);
		WebElement text = driver.findElement(By.name("text"));
		text.click();
		text.clear();
		text.sendKeys(texto);
		By boton = By.id("enviar");
		driver.findElement(boton).click();
	}

	public static void fillFormWithPhoto(WebDriver driver, String titulo, String texto, String foto) {
		WebElement title = driver.findElement(By.name("title"));
		title.click();
		title.clear();
		title.sendKeys(titulo);
		WebElement text = driver.findElement(By.name("text"));
		text.click();
		text.clear();
		text.sendKeys(texto);
		WebElement photo = driver.findElement(By.name("photo"));
		photo.sendKeys(foto);
		By boton = By.id("enviar");
		driver.findElement(boton).click();
	}

}
