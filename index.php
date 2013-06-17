<?php
    $box = "serializedBox";

    //insanely sophisticated and complicated logic to retrieve the contents of the serializedBox GET or POST variable
    if (isset($_GET[$box])) {
        $response = $_GET[$box];
    } else if (isset($_POST[$box])) {
        $response = $_POST[$box];
    } else {
        //default behaviour is to return the acceptance test to demo
        echo file_get_contents("test/acceptance_test.html");
        exit;
    }

    echo str_replace('\\', '', $response);
?>