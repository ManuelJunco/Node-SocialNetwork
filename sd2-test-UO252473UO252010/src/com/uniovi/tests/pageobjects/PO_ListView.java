package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ListView extends PO_NavView{

	public static void search(WebDriver driver, String texto) {
		WebElement busqueda = driver.findElement(By.name("busqueda"));
		busqueda.click();
		busqueda.clear();
		busqueda.sendKeys(texto);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
}
