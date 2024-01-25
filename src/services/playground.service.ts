import { Injectable } from '@angular/core';
import { timer, switchMap, from, filter, take, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  emittedTransactions: string[] = [];

  private txnsQueue: string[] = [];
  private txnUpdateInterval: number = 2 * 1000; // 2 seconds

  constructor() {}

  // Add a transaction to the queue
  addTransaction(transaction: string) {
    this.txnsQueue.push(transaction);
    this.processQueue();
  }

  // Process the queue
  processQueue() {
    if (this.txnsQueue.length === 0) {
      return;
    }

    const currentTransaction = this.txnsQueue[0];

    timer(0, this.txnUpdateInterval)
      .pipe(
        switchMap(() => from(this.isTransactionConfirmed(currentTransaction))),
        filter(isConfirmed => isConfirmed),
        take(1) // Take the first occurrence of a confirmed transaction
      )
      .subscribe(() => {
        this.emitTransaction(currentTransaction);
        this.txnsQueue.shift(); // Remove the confirmed transaction
        this.processQueue(); // Process the next transaction
      });
  }

  // Mock function to check if a transaction is confirmed
  isTransactionConfirmed(transaction: string) {
    return of(/* Call your confirmation checking function here */);
  }

  emitTransaction(transaction: string) {
    this.emittedTransactions.push(transaction);
  }
}
