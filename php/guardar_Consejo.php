<?php

/**
 * Aquest script PHP rep un consell mitjançant la sol·licitud HTTP, el guarda a la base de dades MySQL i proporciona missatges d'èxit o error en l'execució del procés
 */
if (isset($_REQUEST["consejo"])) {
    $consell = $_REQUEST["consejo"];

    $servidor = "localhost";
    $usuari = "root";
    $password = "";
    $dbname = "consejodb"; 

    $conexion = mysqli_connect($servidor, $usuari, $password, $dbname);

    if (!$conexion) {
        echo "Error en la conexión a MySQL: " . mysqli_connect_error();
        exit();
    }

    $stmt = mysqli_prepare($conexion, "INSERT INTO consejos (consejo) VALUES (?)");
    mysqli_stmt_bind_param($stmt, 's', $consell);

    if (mysqli_stmt_execute($stmt)) {
        echo "Consejo insertado correctamente.";
    } else {
        echo "Error en la ejecución de la sentencia preparada: " . mysqli_stmt_error($stmt);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conexion);
}
?>
