<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/6/18
 * Time: 5:28 PM
 */

spl_autoload_register(function ($class_name){
	include 'Database/'. $class_name . '.php';
});
