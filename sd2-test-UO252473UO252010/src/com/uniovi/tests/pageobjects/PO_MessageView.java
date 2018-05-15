package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_MessageView extends PO_NavView {


	static public void sendMessage(WebDriver driver, String id) {
		WebElement userField = driver.findElement(By.className("form-control"));
		userField.click();
		userField.clear();
		userField.sendKeys(id);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

}