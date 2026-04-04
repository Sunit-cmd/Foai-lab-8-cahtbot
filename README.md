# AI Studio: Text-to-Image & Text-to-Text Generator

A modern, high-performance React application serving as a dual-capability AI Studio. Seamlessly leverage the Hugging Face Inference API for cutting-edge text and image generation.

## Features
- **Dual Interface:** An interactive Home screen featuring massive entry portals for navigating between the Image Generator and Text Generator.
- **AI-Native UI/UX:** Built with the `ui-ux-pro-max-skill` design intelligence, featuring clean cyan-green palettes, glassmorphic shadowing, subtle ambient gradients, and crisp spacing.
- **Premium Animations:** Enjoy custom CSS "Pulse" and "Streaming dot" animations while the AI computes your response, completely replacing generic boring spinners.
- **Image Generation:** Native fetch implementation pointing to `stabilityai/stable-diffusion-xl-base-1.0`.
- **Text Generation (OpenAI Schema):** Perfected interaction with `Qwen/Qwen3-4B-Instruct-2507:nscale` using Hugging Face's latest `/v1/chat/completions` REST API standard.

## Fast Setup

### 1. Install Dependencies
Make sure you are in the project root directory, then run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Usage
- Go to the provided local deployment URL (e.g., `http://localhost:5173/`).
- The application natively injects required API endpoints directly. You can simply click the corresponding model and begin prompting immediately!

## Technologies Used
- React (Vite)
- Hugging Face Inference API (Router v1)
- UI UX Pro Max Engine (Agentic System)
