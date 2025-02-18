import { DollarSign, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { Expense } from '../lib/firebase';

interface ExpenseItemProps {
  expense: Expense;
  getCategoryName: (categoryId: string) => string;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

function ExpenseItem({ expense, getCategoryName, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <DollarSign className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{expense.description}</p>
          <p className="text-sm text-gray-500">{getCategoryName(expense.category)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-gray-800">${expense.amount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseItem;