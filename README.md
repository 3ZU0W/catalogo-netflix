# MINUIT — Sistema de Gestión de Cine

Materia: Desarrollo Web Backend
Universidad: Universidad Mayor de San Andrés (UMSA) — Carrera de Informática
Estudiante: Monzerrat Fabiana Mendoza Durán
Proyecto desplegado: https://catalogo-netflix-theta.vercel.app

## Descripción

MINUIT es una aplicación web para la gestión integral de un cine: catálogo de películas, reservas de funciones con control de aforo por sala, panel administrativo, comentarios y calificaciones de usuarios, reportes en PDF, estadísticas, y un asistente conversacional integrado.

## Stack tecnológico

- **Frontend:** React + TypeScript, desplegado en Vercel
- **Backend:** NestJS (Node.js) + TypeORM, desplegado en Railway
- **Base de datos:** PostgreSQL
- **Almacenamiento de imágenes:** Cloudinary
- **IA conversacional:** Groq API (modelo llama3-8b-8192)
- **Contenedores:** Docker y Kubernetes

## Cumplimiento de requisitos del proyecto

| # | Requisito | Estado | Detalle |
|---|-----------|--------|---------|
| 1 | Objetivo bien definido | ✅ | Sistema de gestión y venta de entradas de cine |
| 2 | Menú de navegación | ✅ | Navbar con catálogo, mis reservas, comentarios y panel admin |
| 3 | CRUD con eliminación lógica | ✅ | Reservas: estado `confirmada` / `cancelada` (no se borran físicamente) |
| 4 | Frontend en React | ✅ | `/proyecto` |
| 5 | Backend en NestJS | ✅ | `/backend` |
| 6 | Validaciones en campos de entrada | ✅ | Validación de formularios en frontend y DTOs en backend |
| 7 | Reporte en PDF | ✅ | Exportación de reportes de reservas/ocupación |
| 8 | Gráfico estadístico | ✅ | Panel de estadísticas con gráficos de ocupación y ventas |
| 9 | Autenticación con login, permisos y CAPTCHA | ✅ | JWT + Google reCAPTCHA v2, roles de usuario/admin |
| 10 | Validación de fuerza de contraseña + cifrado | ✅ | Indicador débil/media/fuerte; contraseña almacenada con hash |
| 11 | Log de acceso (usuario, IP, evento, browser, fecha/hora) | ✅ | Módulo `auth/log-acceso` registra ingreso y salida |
| 12 | Repositorio en GitHub del grupo | ✅ | Este repositorio |
| 13 | Despliegue en sitio gratuito | ✅ | Frontend en Vercel, backend en Railway |
| 14 | Implementación con Docker | ✅ | `Dockerfile` y `docker-compose.yml` en `/backend` |
| 15 | Implementación con Kubernetes | ✅ | Manifiestos de Kubernetes incluidos en el proyecto |
| 16 | Versión para dispositivo móvil | ✅ | implementado |
| 17 | Agente inteligente (opcional) | ✅ | Chatbot flotante con IA vía Groq API |

## Estructura del repositorio

```
catalogo-netflix/
├── backend/      # API NestJS (auth, películas, reservas, comentarios, usuarios)
└── proyecto/     # Frontend React
```

## Funcionalidades principales

El backend expone los módulos de autenticación (login, registro, logout y logs de acceso), gestión de películas con CRUD completo y carga de portadas a Cloudinary, reservas con control de aforo por función y cancelación lógica, y comentarios con calificación por estrellas. El frontend consume esta API para mostrar el catálogo, gestionar la compra de entradas, mostrar el historial de reservas del usuario, y dar al administrador un panel con estadísticas, reportes en PDF y control total sobre películas y reservas.

## Cómo ejecutar el proyecto localmente

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd proyecto
npm install
npm run dev
```

## Despliegue

El frontend está desplegado en Vercel y el backend en Railway con una base de datos PostgreSQL administrada también en Railway.
