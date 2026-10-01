# Result photos

The Results section on the home page shows these photos. Each file below is a placeholder
(the student's initials on a tan background). Replace a file with a real photo **using exactly the same
file name**, and the website updates automatically (within about a minute while developing;
on the live site, after the next deploy). No code changes are needed.

| Student     | File name        |
| ----------- | ---------------- |
| Eshanya     | `eshanya.jpg`    |
| Manjunath   | `manjunath.jpg`  |
| Akhil Sai   | `akhil-sai.jpg`  |
| Olive       | `olive.jpg`      |
| Adithya V.S | `adithya-vs.jpg` |
| Aanchal     | `aanchal.jpg`    |
| Siya        | `siya.jpg`       |
| Rishit      | `rishit.jpg`     |
| Vishal      | `vishal.jpg`     |

## Photo requirements

- JPG format, with the `.jpg` extension.
- Square, at least 800 x 800 pixels. Other sizes still work (the site crops to a square),
  but square photos look best.
- Face centred, head and shoulders, looking at the camera.
- Plain or softly blurred background preferred.
- Good, even light. The site adds the same gentle warm tone to every photo, so they look
  like one set.
- Only use a photo when the student (and a parent, for students under 18) has agreed to
  it being shown on the website.

## Adding a new student

Put their photo here as `their-name.jpg`, then add an entry in `data/results.ts` with
`photo: "/results/their-name.jpg"`.
