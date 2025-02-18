import { DollarSign } from 'lucide-react'
import React from 'react'
import { Expense } from '../lib/firebase'

function ExpenseItem({expense , getCategoryName}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <DollarSign className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="font-medium text-gray-800">{expense.description}</p>
        <p className="text-sm text-gray-500">{getCategoryName(expense.categoryId)}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-800">${expense.amount.toFixed(2)}</p>
      <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
    </div>
  </div>
  )
}

export default ExpenseItem