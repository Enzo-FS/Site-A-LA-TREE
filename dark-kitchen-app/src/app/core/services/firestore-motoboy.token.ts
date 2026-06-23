import { InjectionToken } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

export const FIRESTORE_MOTOBOY = new InjectionToken<Firestore>('FirestoreMotoboy');