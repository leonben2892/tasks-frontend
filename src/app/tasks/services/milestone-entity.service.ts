import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { Milestone } from '../models/milestone.model';

@Injectable({providedIn: 'root'})
export class MilestoneEntityService extends EntityCollectionServiceBase<Milestone> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Milestone', serviceElementsFactory);
  }
}
