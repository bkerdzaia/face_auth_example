from typing import IO, ByteString, List, Union

import numpy as np
import face_recognition


def encode(img_file: IO) -> ByteString:
    img = face_recognition.load_image_file(img_file)
    faces_encodings = face_recognition.face_encodings(img)
    if len(faces_encodings) == 0:
        return False
    faces_encodings = faces_encodings[0]
    encodings = faces_encodings.tobytes()
    return encodings


def compare(img_file: IO, known_faces: List[np.ndarray]) -> Union[bool, List[bool]]:
    img = face_recognition.load_image_file(img_file)
    faces_encodings = face_recognition.face_encodings(img)
    if len(faces_encodings) == 0:
        return False
    faces_encodings = faces_encodings[0]
    results = face_recognition.compare_faces(known_faces, faces_encodings)
    return results
