# Listening-Neurological-Health

I would like to build a demo with react, I would have a home page, two project page that could be jumped when selecting from the home page, from each project page, I need a back to home button. The theme should be blue, and academic.

Home 

The title is “LISTENING TO NEUROLOGICAL HEALTH”

subtitle: Speech Analysis with Signal Processing and Machine Learning

introduction sentence: Speech is a rich signal. What can we learn from it?

Button 1 Process Speech - Noise Reduction

Button 2 Analyse speech - Neurological health

Process speech

Title: Process speech

Introduction sentence: Choose an environment {BUS, CAF, STR, PED}

(Once they picked, load from local files from a folder)

on the page, show 

“Clean” waveform on top of spectrogram, with a button >Listen

“Noisy” waveform on top of spectrogram, with a button >Listen

“Enhanced” waveform on top of spectrogram, with a button >Listen


A sentence noise reduction: +7.2 dB (depends on the audio file chosen, this number will be read from a .csv)

bottom of the page should have try another, and Next two buttons




When Next is clicked, it will be a page title “Want to try it with your own voice?”

There will be a message highlighted your recording will only be used to demonstrate noise reduction, your voice will NOT be analysed for neurological conditions.  There will be a record button, then there will be analyse your speech button, which will trigger processing the file on a gpu on SLURM. Once the processing is ready, the button “Play enhanced speech” should be green, and could play the speech. Bottom should has a button “Delete my recording”, once it is clicked, delete the recording, and show a popup message on the screen “Recording has been deleted"

Analyse speech

Title: Analyse speech

Subtitle: Speech analysis & Machine Learning

Introduction sentence: How can subtle charactereistics of speech provide information about neurological health?

show a pipeline: speech -> extract speech features -> machine learning -> prediction -> explanation

Highlight a sentence “Uses pre-recorded research speech only”

Bottom of the page has button “start”

“LISTEN”

Title: LISTEN

“Can you hear subtle differences?” Play button for speaker A, Play button for speaker B

“Which sounds more typical of healthy speech?” [A] [B] [Not sure] 

[Reveal]

[Next->]

“ANALYSE”

Title: ANALYSE

“What does the computer measure?”

left column: show waveform on top of spectrogram 

right column:  a table of  Speech features  pitch, pitch variation, loudness, f1, f2, f3, speech rate,…

[Next ->]

“PREDICT”

Title: PREDICT

show pipeline: Speech features -> ML Model -> Healthy …27% Pathological … 73%

Highlight: Model prediction only for research development purpose, NOT a medical diagnosis.

[Why this prediction?]

“WHY”

Title: Why did the model prediction this?

“Feature contribution”

(read feature values/ shap from .csv) or directly from a saved shap analysis screenshot

“Click a feature to learn more” - this will show a popup window of the definition of the feature

[Finish]

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
