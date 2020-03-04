import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { shareReplay, scan, map } from 'rxjs/operators';
import { initialState } from './state';
import { Actions } from './actions';
import { reducer } from './reducer';
import { Selector } from '../selector/selector';

@Injectable({ providedIn: 'root' })
export class Store {
  private readonly replayBufferSize = 100;
  private actionsSubject = new ReplaySubject<Actions>(this.replayBufferSize);

  state$ = this.actionsSubject.pipe(scan(reducer, initialState), shareReplay());

  dispatch(action: Actions): void {
    this.actionsSubject.next(action);
  }

  select<T>(selector: Selector<T>): Observable<T> {
    return this.state$.pipe(map(state => selector.execute(state)));
  }
}
