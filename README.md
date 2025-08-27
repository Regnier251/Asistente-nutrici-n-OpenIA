# 🥗 NutriChat - Generador de Planes de Dieta Personalizados

Este es un proyecto backend construido con **Node.js** y **Express**, que utiliza la API de **OpenAI** para generar planes de alimentación personalizados en función de las respuestas del usuario.

## 📋 Descripción

NutriChat funciona como un asistente virtual de nutrición. A través de una serie de preguntas, recopila datos del usuario (peso, estatura, objetivo, alergias, etc.) y genera un **plan de dieta semanal** en formato tabla utilizando **GPT-3.5-Turbo**.

---

## 🧠 Funcionalidades

- Recoge datos del usuario paso a paso mediante una API RESTful.
- Procesa estos datos y genera un prompt personalizado para OpenAI.
- Devuelve una tabla con un plan de alimentación semanal:
  - Día
  - Comida
  - Almuerzo
  - Cena
  - Snacks
  - Calorías

---
 
## 📷 Captura
<img width="1336" height="739" alt="Screenshot from 2025-08-27 11-13-20" src="https://github.com/user-attachments/assets/4477252f-e1e1-4986-9d15-e49c1a147684" />

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- dotenv
- OpenAI SDK

---

## ⚙️ Instalación
- Clonar repositorio
- npm install
- npm start
