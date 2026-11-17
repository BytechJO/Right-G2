# Right G2 — Teacher Edition

Right G2 is an interactive digital English course built with React and Vite. This repository contains the Teacher Edition, including the Student Book, Workbook, Teacher’s Book, and supporting learning materials.

## Contents

- [Requirements](#requirements)
- [Get the code](#get-the-code)
- [Run locally](#run-locally)
- [Build the website](#build-the-website)
- [Create the SCORM package](#create-the-scorm-package)
- [Understand SCORM tracking](#understand-scorm-tracking)
- [Project structure](#project-structure)
- [Common tasks](#common-tasks)

## Requirements

- Node.js and npm
- Windows PowerShell to run the included SCORM packaging command
- An LMS that accepts SCORM 1.2 packages, if you plan to publish the course

## Get the code

```bash
git clone https://github.com/BytechJO/Right-G2.git
cd Right-G2
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

## Run locally

Start the Vite development server:

```bash
npm run dev
```

Open the local address printed in the terminal. Vite reloads the application as you edit files under `src/`.

## Build the website

```bash
npm run build
```

Vite writes the production web build to `dist-scorm/`. This is the build output, not the uploadable SCORM ZIP.

To preview the build locally:

```bash
npm run preview
```

## Create the SCORM package

From the repository folder on Windows, run:

```powershell
npm run package:scorm
```

This command builds the latest source, adds the SCORM manifest, and creates:

```text
release/Right-G2-Teacher-SCORM12.zip
```

The command replaces the ZIP at that path each time. Upload the ZIP itself to your LMS or SCORM Cloud; do not unzip it first. After changing course code, run the command again and upload the newly generated ZIP as an updated course package/version.

The generated `dist-scorm/` and `release/` folders are ignored by Git. A fresh clone does not include the ZIP; generate it locally with the command above.

## Understand SCORM tracking

The package uses **SCORM 1.2**.

| LMS value | What the course reports |
| --- | --- |
| Location | Current section and page, used to resume on the next launch |
| Suspend data | Pages visited in the Student Book, Workbook, and Teacher’s Book |
| Session time | Time spent in the current LMS session |
| Lesson status | `incomplete` until every page in all three books has been visited, then `completed` |
| Score | No numeric score is sent by this course |

SCORM tracking activates when the course is launched from an LMS that provides the SCORM 1.2 API. When opened outside an LMS, the app continues to work and saves the current section/page in the browser instead.

To check a new package, upload it to a SCORM test environment, launch it, move between sections/pages, close and relaunch to check resume behavior, then review the completion status.

## Project structure

```text
Right-G2/
├── src/                    React application and course content
│   ├── component/          Book navigation, pages, exercises, and viewers
│   └── assets/             Images, audio, and other course media
├── public/                 Static files copied into the build
├── scorm/                  SCORM 1.2 manifest template
├── scripts/                SCORM packaging script
├── dist-scorm/             Generated web build (ignored by Git)
└── release/                Generated SCORM ZIP (ignored by Git)
```

## Common tasks

| Task | Command |
| --- | --- |
| Install dependencies | `npm ci` |
| Run the development server | `npm run dev` |
| Build the website | `npm run build` |
| Preview the website build | `npm run preview` |
| Generate or refresh the SCORM ZIP | `npm run package:scorm` |
| Run ESLint | `npm run lint` |

## Notes

- Keep source code and course assets in the repository; generated build and release folders are not committed.
- Share the repository with developers. They can create the SCORM ZIP locally after installing dependencies.
- The SCORM ZIP is an LMS deliverable; GitHub holds the code and packaging instructions, not the generated ZIP.
