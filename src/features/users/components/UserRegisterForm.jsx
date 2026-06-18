// UserRegisterForm componente para registrar un usuario

import { useState, useEffect } from "react";
import { Input, Select, Checkbox, Button } from "@/shared";
import { getDocumentTypes } from "@/services/selectService";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../schemas/userSchema";

export default function UserRegisterForm() {

  // Estado
  // const [isSubmitting, setIsSubmitting] = useState(false);


  // Navegación
  const navigate = useNavigate();

  // Estado del error
  const [ errors, setErrors] = useState({})

  // Estado del formulario
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userDocumentTypes: "",
    userDocumentNumber: "",
    userPassword: "",
    userImage: [],

    // Flags booleanos
    isStaff: false,
    isActive: true,
    isSuperUser: false,
  });

  // Estado para los tipos de documento
  const [documentTypes, setDocumentTypes] = useState([]);

  // Uso del estado useEffect
  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);
  }, []);

  // ======================================
  //            Handle Genérico
  // ======================================
  /**
   * Función que se ejecuta cada vez que cambia el valor de un input del formulario
   */
  const handleChange = (e) => {
    // Se obtiene el nombre del campo y su valor
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      // Se copian todos los valores anteriores del estado
      ...prev,

      // Se actualiza unicamente lo que cambió
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // //============== HANDLE SUBMIT ==============

  const handleSubmit = async (e) => {
    // Evita que el formulario recargue la página
    e.preventDefault();

    console.log("FORM DATA:", formData);
    console.log("BOOLEANS:", {
      isStaff: formData.isStaff,
      isActive: formData.isActive,
      isSuperUser: formData.isSuperUser,
    });

    // Validamos los datos del formulario contra el esquema Zod
    // safeParse NO lanza excepción, retorna un objeto controlado
    const result = userSchema.safeParse(formData);

    // Verificar en consola si el esquema está funcionando correctamente
    // console.log(result);

    // Si la validación falla
    if (!result.success) {
      // Objeto donde almacenaremos los errores por campo
      const fieldErrors = {};

      // Recorremos cada error generado por Zod
      result.error.issues.forEach((issue) => {
        // issue.path[0] corresponde al nombre del campo
        // issue.message contiene el mensaje de error definido en el schema
        fieldErrors[issue.path[0]] = issue.message;
      });

      // Actualizamos el estado de errores para mostrarlos en la UI
      setErrors(fieldErrors);

      // Cortamos la ejecución: NO se envía nada al backend
      return;
    }

    // Si la validación pasa, limpiamos errores previos
    setErrors({});

    // Activamos estado de envío (útil para deshabilitar el botón)
    // setIsSubmitting(true);

    try {
      // Llamamos al servicio frontend que consume la API
      // result.data contiene los datos ya validados por Zod
      // const response = await createUser(result.data);

      // Log informativo para desarrollo
      // console.log("Usuario creado:", response);

      // Feedback básico al usuario
      alert("Usuario creado correctamente");

      // Navegamos a la vista anterior
      // navigate(-1) equivale a "volver atrás"
      // navigate(-1);
    } catch (error) {
      // Capturamos errores de red o errores lanzados por el service
      console.error("Error:", error.message);

      // Mostramos el mensaje de error al usuario
      alert(error.message);
    } finally {
      // Pase lo que pase, desactivamos el estado de envío
      // setIsSubmitting(false);
    }
  };

  // ======================================
  //            Handle NameChange
  // ======================================
  // const handleNameChange = (e) => {
  //   const value = e.target.value.trim();

  //   if (value === "") {
  //     console.log("El nombre no puede estar vacío");
  //   }
  // };

  return (
    <div className="grid items-center justify-center">
      <h1 className="mx-auto my-10 text-title font-heading font-bold">
        Registro de usuarios
      </h1>
      <form action="" onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="userName"
          type="text"
          value={formData.userName}
          placeholder="Ingrese su nombre"
          htmlFor="user-name"
          onChange={handleChange}
          error={errors.userName}
        />
        <Input
          label="Correo"
          name="userEmail"
          type="email"
          value={formData.userEmail}
          placeholder="Escribe tu correo electrónico"
          htmlFor="user-email"
          error={errors.userEmail}
          onChange={handleChange}
        />
        <Input
          label="Teléfono"
          name="userPhone"
          type="tel"
          value={formData.userPhone}
          placeholder="Escribe tu número de teléfono"
          htmlFor="user-phone"
          error={errors.userPhone}
          onChange={handleChange}
        />
        <Select
          label="Tipos de documento"
          name="userDocumentTypes"
          value={formData.userDocumentTypes}
          htmlFor="userDocumentTypes"
          options={documentTypes}
          onChange={handleChange}
          error={errors.userDocumentTypes}
        />
        <Input
          label="Documento"
          name="userDocumentNumber"
          type="text"
          value={formData.userDocumentNumber}
          placeholder="Escribe tu número de documento"
          htmlFor="user-document-number"
          error={errors.userDocumentNumber}
          onChange={handleChange}
        />
        <Input
          label="Contraseña"
          name="userPassword"
          type="password"
          value={formData.userPassword}
          placeholder="Escribe tu contraseña"
          htmlFor="user-password"
          error={errors.userPassword}
          onChange={handleChange}
        />

        {/* Checkbox */}
        <div className="grid gap-4 my-2">
          <Checkbox
            id="isSuperUser"
            name="isSuperUser"
            label="Es super usuario"
            checked={formData.isSuperUser}
            onChange={handleChange}
          />
          <Checkbox
            id="isStaff"
            name="isStaff"
            label="Es staff"
            checked={formData.isStaff}
            onChange={handleChange}
          />
          <Checkbox
            id="isActive"
            name="isActive"
            label="Está activo"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-6 items-center">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => console.log("Se oprimió el cancelar")}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            onClick={() => console.log("Se oprimió el submit")}
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}