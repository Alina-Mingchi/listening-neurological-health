# Listening-Neurological-Health

LISTENING TO NEUROLOGICAL HEALTH
Speech Analysis with Signal Processing and Machine Learning

An interactive scientific open-house demonstrator illustrating how speech can be processed using digital signal processing, acoustic feature extraction, and machine learning.

1. Overview

LISTENING TO NEUROLOGICAL HEALTH is an interactive web-based demonstration designed for a general public audience at a scientific open house.

The demonstrator introduces visitors to two related concepts:

**Speech enhancement and noise reduction**
How can signal-processing methods improve speech recorded in noisy environments?

**Speech analysis and machine learning**
How can measurable characteristics of speech be transformed into features and subsequently used by a machine-learning model to investigate patterns associated with neurological health?

The application deliberately separates these two activities.

Visitors may experiment with noise reduction using their own voice, but their personal recording is never analysed for neurological conditions. The neurological-health demonstration instead uses pre-recorded research speech.

The objective is educational and scientific communication rather than clinical assessment.


The demonstrator provides an intuitive introduction to this research pipeline:

Speech
   ↓
Signal processing
   ↓
Speech-feature extraction
   ↓
Machine-learning model
   ↓
Prediction
   ↓
Feature-based explanation

The application is intended to make this process understandable without requiring visitors to have a background in signal processing, machine learning, or neuroscience.

3. Demonstration Structure

The application consists of a home page and two interactive project paths.

                         HOME
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
     PROCESS SPEECH             ANALYSE SPEECH
     Noise reduction             Machine learning
             │                         │
             ▼                         ▼
       Own voice                 LISTEN → ANALYSE
             │                         │
             ▼                         ▼
       GPU / SLURM                PREDICT → WHY

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d82e4271-47b3-4e13-a1e2-7a159e04a768).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
