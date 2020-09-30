<?php
// cabeceras
header('Content-Type: text/html; charset=UTF-8'); // envio de correos con eñes y acentos
/* Cabeceras HTTP para permitir el acceso CORS con Apache o con otro servidor web. */
header('Access-Control-Allow-Origin: *'); // si quisiramos restringir el origen de las peticiones,cambiamos * por el origen
header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}

// cargamos el entorno
require_once 'vendor/autoload.php';
require_once 'piramide-uploader/PiramideUploader.php';

$app = new \Slim\Slim();

// conexion con bd
$db = new mysqli('localhost', 'root', '', 'webbase');

// listado usuarios
$app->get("/usuarios", function () use ($app, $db) {
    mysqli_set_charset($db, 'utf8');
    $stmt = $db->prepare("SELECT * FROM usuarios;");
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows > 0) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// return 1 usuario
$app->get("/usuario/:id", function ($id) use ($app, $db) {
    mysqli_set_charset($db, 'utf8');
    $stmt = $db->prepare("SELECT * FROM usuarios WHERE id = '$id';");
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows == 1) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// login con prepared statement
$app->post("/login", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['email'])) {
        $data['email'] = null;
    }
    if (!isset($data['password'])) {
        $data['password'] = null;
    }
    // formatear para evitar SQL injection
    $email = $db->real_escape_string($data['email']);
    $password = $db->real_escape_string($data['password']);
    // $pwd = hash('sha256', $password);

    $stmt = $db->prepare("SELECT id, nombre, apellidos, email, imagen, rol FROM usuarios WHERE email = ? AND password = ?;");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $query = $stmt->get_result();

    $datos = array();
    if ($query->num_rows == 1) {

        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Acceso correcto',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Usuario y password incorrectos',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// editar datos usuario
$app->post("/editar-usuario", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['nombre'])) {
        $data['nombre'] = null;
    }
    if (!isset($data['apellidos'])) {
        $data['apellidos'] = null;
    }
    if (!isset($data['email'])) {
        $data['email'] = null;
    }
    if (!isset($data['password'])) {
        $data['password'] = null;
    }

    $nombre = $db->real_escape_string($data['nombre']);
    $apellidos = $db->real_escape_string($data['apellidos']);
    $email = $db->real_escape_string($data['email']);
    $id = $db->real_escape_string($data['id']);
    $password = $db->real_escape_string($data['password']);
    $imagen = $db->real_escape_string($data['imagen']);
    $rol = $db->real_escape_string($data['rol']);

    $stmt = $db->prepare("UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, password = ?, imagen = ?, rol = ? WHERE id = ?;");
    $stmt->bind_param("sssssis", $nombre, $apellidos, $email, $password, $imagen, $rol, $id);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos actualizados'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Datos no actualizados'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// nuevo usuario
$app->post("/nuevo-usuario", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['nombre'])) {
        $data['nombre'] = null;
    }
    if (!isset($data['apellidos'])) {
        $data['apellidos'] = null;
    }
    if (!isset($data['email'])) {
        $data['email'] = null;
    }
    if (!isset($data['password'])) {
        $data['password'] = null;
    }

    $nombre = $db->real_escape_string($data['nombre']);
    $apellidos = $db->real_escape_string($data['apellidos']);
    $email = $db->real_escape_string($data['email']);
    $password = $db->real_escape_string($data['password']);
    $imagen = $db->real_escape_string($data['imagen']);
    $rol = $db->real_escape_string($data['rol']);

    $stmt = $db->prepare("INSERT INTO usuarios (nombre, apellidos, email, password, imagen, rol) VALUES (?, ?, ?, ?, ?, ?);");
    $stmt->bind_param("ssssss", $nombre, $apellidos, $email, $password, $imagen, $rol);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Usuario insertado'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'usuario no insertado'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// editar datos usuario
$app->post("/eliminar-usuario", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['email'])) {
        $data['email'] = null;
    }

    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("DELETE FROM usuarios WHERE id = ?;");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Usuario eliminado'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Usuario no eliminado'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// obtener rol
$app->post("/rol", function () use ($app, $db) {
    mysqli_set_charset($db, 'utf8');
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['email'])) {
        $data['email'] = null;
    }

    $email = $db->real_escape_string($data['email']);

    $stmt = $db->prepare("SELECT rol FROM usuarios WHERE email = '$email';");
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows > 0) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// obtener imagen de usuario
$app->post("/imagen-usuario", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("SELECT imagen FROM usuarios WHERE id = ?;");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows > 0) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// actualizar imagen usuario
$app->post("/actualizar-imagen-usuario", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("UPDATE usuarios SET imagen = 'imagen-default.jpg' WHERE id = ?;");
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Imagen borrada'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Imagen no borrada'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// subir imagen de usuario
$app->post("/subir-imagen-usuario", function () use ($app, $db) {
    $result = array(
        'status'  => 'error',
        'code'    => 404,
        'message' => 'El archivo no ha podido subirse correctamente',
        'data'    => null
    );

    $folder = "./resources/usuarios/";

    if (isset($_FILES['uploads'])) {
        $archivo = $_FILES['uploads'];
        $nombre = $archivo['name'];
        $Uploader = new PiramideUploader();
        $upload = $Uploader->upload($nombre, "uploads", $folder, array('image/jpeg', 'image/png', 'image/gif'), true);
        $file = $Uploader->getInfoFile();
        $file_complete_name = $file['complete_name']; // nombre del archivo guardado
        $file_name = $file['name']; // nombre del archivo subido original

        if (isset($upload) && $upload['uploaded'] == false) {

            $result = array(
                'status'  => 'error',
                'code'    => 404,
                'message' => 'El archivo no ha podido subirse correctamente',
                'data'    => null
            );
        } else {
            $result = array(
                'status'  => 'success',
                'code'    => 200,
                'message' => 'El archivo se ha subido correctamente',
                'data'    => $file_complete_name // nombre del archivo subido original
            );
        }
    } else {
        echo "NO He recibido el archivo";
    }

    echo json_encode($result);
});

// listado productos
$app->get("/productos", function () use ($app, $db) {
    mysqli_set_charset($db, 'utf8');
    $stmt = $db->prepare("SELECT * FROM productos;");
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows > 0) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// return 1 producto
$app->get("/producto/:id", function ($id) use ($app, $db) {
    mysqli_set_charset($db, 'utf8');
    $stmt = $db->prepare("SELECT * FROM productos WHERE id = '$id';");
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows == 1) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// editar datos producto
$app->post("/editar-producto", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['referencia'])) {
        $data['referencia'] = null;
    }
    if (!isset($data['descripcion'])) {
        $data['descripcion'] = null;
    }
    if (!isset($data['unidades'])) {
        $data['unidades'] = null;
    }
    if (!isset($data['precio'])) {
        $data['precio'] = null;
    }

    $referencia = $db->real_escape_string($data['referencia']);
    $descripcion = $db->real_escape_string($data['descripcion']);
    $unidades = $db->real_escape_string($data['unidades']);
    $precio = $db->real_escape_string($data['precio']);
    $imagen = $db->real_escape_string($data['imagen']);
    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("UPDATE productos SET referencia = ?, descripcion = ?, unidades = ?, precio = ?, imagen = ? WHERE id = ?;");
    $stmt->bind_param("ssssss", $referencia, $descripcion, $unidades, $precio, $imagen, $id);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos actualizados'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Datos no actualizados'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// nuevo producto
$app->post("/nuevo-producto", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    if (!isset($data['referencia'])) {
        $data['referencia'] = null;
    }
    if (!isset($data['descripcion'])) {
        $data['descripcion'] = null;
    }
    if (!isset($data['unidades'])) {
        $data['unidades'] = null;
    }
    if (!isset($data['precio'])) {
        $data['precio'] = null;
    }

    $referencia = $db->real_escape_string($data['referencia']);
    $descripcion = $db->real_escape_string($data['descripcion']);
    $unidades = $db->real_escape_string($data['unidades']);
    $imagen = $db->real_escape_string($data['imagen']);
    $precio = $db->real_escape_string($data['precio']);

    $stmt = $db->prepare("INSERT INTO productos (referencia, descripcion, unidades, imagen, precio) VALUES (?, ?, ?, ?, ?);");
    // $stmt = $db->prepare("INSERT INTO productos (referencia, descripcion, unidades, precio) VALUES (?, ?, ?, ?);");
    $stmt->bind_param("sssss", $referencia, $descripcion, $unidades, $imagen, $precio);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Producto insertado'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Producto no insertado'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// eliminar producto
$app->post("/eliminar-producto", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("DELETE FROM productos WHERE id = ?;");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Producto eliminado'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Producto no eliminado'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

// subir imagen de producto
$app->post("/subir-imagen-producto", function () {
    $result = array(
        'status'  => 'error',
        'code'    => 404,
        'message' => 'El archivo no ha podido subirse correctamente',
        'data'    => null
    );

    $folder = "./resources/productos/";

    if (isset($_FILES['uploads'])) {
        $archivo = $_FILES['uploads'];
        $nombre = $archivo['name'];
        $Uploader = new PiramideUploader();
        $upload = $Uploader->upload($nombre, "uploads", $folder, array('image/jpeg', 'image/png', 'image/gif'), true);
        $file = $Uploader->getInfoFile();
        $file_complete_name = $file['complete_name']; // nombre del archivo guardado
        $file_name = $file['name']; // nombre del archivo subido original

        if (isset($upload) && $upload['uploaded'] == false) {

            $result = array(
                'status'  => 'error',
                'code'    => 404,
                'message' => 'El archivo no ha podido subirse correctamente',
                'data'    => null
            );
        } else {
            $result = array(
                'status'  => 'success',
                'code'    => 200,
                'message' => 'El archivo se ha subido correctamente',
                'data'    => $file_complete_name // nombre del archivo subido original
            );
        }
    } else {
        echo "NO He recibido el archivo";
    }

    echo json_encode($result);
});

// obtener imagen de producto
$app->post("/imagen-producto", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("SELECT imagen FROM productos WHERE id = ?;");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $query = $stmt->get_result();
    $datos = array();

    if ($query->num_rows > 0) {
        while ($row = $query->fetch_assoc()) {
            $datos[] = $row;
        }

        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Datos encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'success',
            'code' => 400,
            'message' => 'Datos no encontrados',
            'data' => $datos
        );
        echo json_encode($result);
    }
    $stmt->close();
    $db->close();
});

// actualizar imagen producto
$app->post("/actualizar-imagen-producto", function () use ($app, $db) {
    $json = $app->request->post('json');
    $data = json_decode($json, true);

    $id = $db->real_escape_string($data['id']);

    $stmt = $db->prepare("UPDATE productos SET imagen = 'producto-default.jpg' WHERE id = ?;");
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) {
        $result = array(
            'status' => 'success',
            'code' => 200,
            'message' => 'Imagen borrada'
        );
        echo json_encode($result);
    } else {
        $result = array(
            'status' => 'error',
            'code' => 400,
            'message' => 'Imagen no borrada'
        );
        echo json_encode($result);
    }

    $stmt->close();
    $db->close();
});

$app->run();
