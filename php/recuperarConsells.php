<?php

/**
 * Aquest script realitza la cerca a la base de dades de consells
 */

$servidor = "localhost";
$usuari = "root";
$password = "";
$dbname = "consejodb"; 

$conexion = mysqli_connect($servidor, $usuari, $password, $dbname);

if (!$conexion) {
    echo json_encode(['error' => 'Error en la conexión a MySQL: ' . mysqli_connect_error()]);
    exit();
}

$terminoBusqueda = isset($_GET["termino"]) ? $_GET["termino"] : '';

if ($terminoBusqueda === '') {
    $resultado = mysqli_query($conexion, "SELECT * FROM consejos");
} else {
    $stmt = mysqli_prepare($conexion, "SELECT * FROM consejos WHERE consejo LIKE ?");
    $terminoBusqueda = '%' . $terminoBusqueda . '%';
    mysqli_stmt_bind_param($stmt, 's', $terminoBusqueda);

    if (mysqli_stmt_execute($stmt)) {
        $resultado = mysqli_stmt_get_result($stmt);
    } else {
        echo json_encode(['error' => 'Error en la ejecución de la búsqueda: ' . mysqli_stmt_error($stmt)]);
        exit();
    }

    mysqli_stmt_close($stmt);
}

$consejos = [];

while ($fila = mysqli_fetch_assoc($resultado)) {
    $consejos[] = $fila;
}

echo json_encode($consejos);

mysqli_close($conexion);
?>
