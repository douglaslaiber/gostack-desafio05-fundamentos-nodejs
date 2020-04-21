import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total: balanceTotal } = this.transactionsRepository.getBalance();

    if (['income', 'outcome'].indexOf(type) === -1) {
      throw Error('Transaction type not allowed!');
    }

    if (type === 'outcome' && value > balanceTotal) {
      throw Error('Unable to make the transaction: value not available');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
