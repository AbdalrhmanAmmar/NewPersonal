import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles, Brain, Calculator, Calendar } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useGoalsStore } from '../store/GoalStore';
import { useBalanceStore } from '../store/balanceStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  analysis?: {
    type: 'spending' | 'savings' | 'budget';
    data: any;
  };
}

interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

const FinancialChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your advanced financial assistant powered by AI. I can help you with detailed financial analysis, personalized recommendations, and more!",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ['Analyze my spending', 'Budget recommendations', 'Financial health check'],
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { expenses } = useExpenseStore();
  const { goals } = useGoalsStore();
  const { calculateTotalBalance, calculateMonthlyExpenses } = useBalanceStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSpendingPatterns = (): SpendingPattern[] => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => {
      const percentage = (amount / totalSpent) * 100;
      // Simplified trend calculation - could be enhanced with historical data
      const trend = percentage > 30 ? 'up' : percentage < 10 ? 'down' : 'stable';
      
      return {
        category,
        amount,
        percentage,
        trend,
      };
    }).sort((a, b) => b.amount - a.amount);
  };

  const generateBudgetRecommendations = () => {
    const monthlyExpenses = calculateMonthlyExpenses();
    const patterns = analyzeSpendingPatterns();
    const totalBalance = calculateTotalBalance();

    const recommendations = [];
    const highSpendingCategories = patterns.filter(p => p.percentage > 25);
    
    if (highSpendingCategories.length > 0) {
      recommendations.push(`Consider reducing spending in ${highSpendingCategories.map(c => c.category).join(', ')}`);
    }

    if (monthlyExpenses > totalBalance * 0.6) {
      recommendations.push('Your monthly expenses are high relative to your balance. Consider creating a stricter budget.');
    }

    // Calculate ideal budget allocation
    const idealBudget = {
      Necessities: 0.5, // 50% for needs
      Savings: 0.3,     // 30% for savings
      Wants: 0.2,       // 20% for wants
    };

    return {
      recommendations,
      idealBudget,
      currentSpending: patterns,
    };
  };

  const calculateFinancialHealth = () => {
    const monthlyExpenses = calculateMonthlyExpenses();
    const totalBalance = calculateTotalBalance();
    const patterns = analyzeSpendingPatterns();
    
    // Calculate various financial ratios
    const savingsRatio = (totalBalance - monthlyExpenses) / totalBalance;
    const expenseRatio = monthlyExpenses / totalBalance;
    const diversification = patterns.length;
    
    let healthScore = 0;
    healthScore += savingsRatio > 0.2 ? 30 : savingsRatio > 0.1 ? 15 : 0;
    healthScore += expenseRatio < 0.5 ? 40 : expenseRatio < 0.7 ? 20 : 0;
    healthScore += diversification > 5 ? 30 : diversification > 3 ? 15 : 0;

    return {
      score: healthScore,
      metrics: {
        savingsRatio: (savingsRatio * 100).toFixed(1) + '%',
        expenseRatio: (expenseRatio * 100).toFixed(1) + '%',
        diversification,
      },
      status: healthScore > 70 ? 'Excellent' : healthScore > 50 ? 'Good' : healthScore > 30 ? 'Fair' : 'Needs Attention',
    };
  };

  const generateResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'bot',
      timestamp: new Date(),
    };

    // Analyze spending patterns
    if (input.includes('analyze') && input.includes('spend')) {
      const patterns = analyzeSpendingPatterns();
      const topCategories = patterns.slice(0, 3);
      
      response.text = `Here's your spending analysis:\n\n${topCategories.map(p => 
        `${p.category}: $${p.amount.toFixed(2)} (${p.percentage.toFixed(1)}%) - Trend: ${p.trend}`
      ).join('\n')}\n\nWould you like to see the full breakdown or get budget recommendations?`;
      
      response.analysis = {
        type: 'spending',
        data: patterns,
      };
      response.suggestions = ['Full breakdown', 'Budget recommendations', 'How can I improve?'];
    }
    
    // Budget recommendations
    else if (input.includes('budget') || input.includes('recommend')) {
      const budget = generateBudgetRecommendations();
      
      response.text = `Based on your spending patterns, here are my recommendations:\n\n${
        budget.recommendations.join('\n')}\n\nIdeal Budget Allocation:\n` +
        `- Necessities: 50%\n- Savings: 30%\n- Wants: 20%\n\nWould you like a detailed plan?`;
      
      response.analysis = {
        type: 'budget',
        data: budget,
      };
      response.suggestions = ['Create budget plan', 'Show my spending', 'Financial health check'];
    }
    
    // Financial health check
    else if (input.includes('health') || input.includes('check')) {
      const health = calculateFinancialHealth();
      
      response.text = `Your Financial Health Score: ${health.score}/100 (${health.status})\n\n` +
        `Key Metrics:\n- Savings Ratio: ${health.metrics.savingsRatio}\n` +
        `- Expense Ratio: ${health.metrics.expenseRatio}\n` +
        `- Spending Diversification: ${health.metrics.diversification} categories\n\n` +
        `Would you like personalized recommendations to improve your score?`;
      
      response.suggestions = ['Get recommendations', 'Analyze spending', 'Show budget plan'];
    }
    
    // Enhanced balance check
    else if (input.includes('balance') || input.includes('how much') || input.includes('money')) {
      const balance = calculateTotalBalance();
      const monthlyExpenses = calculateMonthlyExpenses();
      const remainingBudget = balance - monthlyExpenses;
      
      response.text = `Current Balance: $${balance.toFixed(2)}\n` +
        `Monthly Expenses: $${monthlyExpenses.toFixed(2)}\n` +
        `Remaining Budget: $${remainingBudget.toFixed(2)}\n\n` +
        `Based on your spending patterns, you ${
          remainingBudget > monthlyExpenses * 0.5 ? 'are in good shape' : 'might want to consider reducing expenses'
        }.`;
      
      response.suggestions = ['Show expenses', 'Budget advice', 'Savings tips'];
    }
    
    // Enhanced expense check
    else if (input.includes('expense') || input.includes('spent')) {
      const monthlyExpenses = calculateMonthlyExpenses();
      const patterns = analyzeSpendingPatterns();
      const topExpense = patterns[0];
      
      response.text = `This month's expenses: $${monthlyExpenses.toFixed(2)}\n\n` +
        `Highest spending category: ${topExpense.category}\n` +
        `Amount: $${topExpense.amount.toFixed(2)} (${topExpense.percentage.toFixed(1)}% of total)\n` +
        `Trend: ${topExpense.trend}\n\n` +
        `Would you like to see a detailed breakdown or get saving tips?`;
      
      response.suggestions = ['Show breakdown', 'Saving tips', 'Budget advice'];
    }
    
    // Enhanced goals check
    else if (input.includes('goal') || input.includes('target')) {
      if (goals.length === 0) {
        response.text = "You haven't set any financial goals yet. Would you like to create one? " +
          "I can help you set realistic targets based on your income and spending patterns.";
        response.suggestions = ['Create new goal', 'Suggest goal amount', 'Show example goals'];
      } else {
        const nextGoal = goals[0];
        const progress = (nextGoal.currentAmount / nextGoal.targetAmount) * 100;
        const monthlyExpenses = calculateMonthlyExpenses();
        const suggestedMonthlyContribution = (nextGoal.targetAmount - nextGoal.currentAmount) / 6; // 6 months plan
        
        response.text = `Goal: ${nextGoal.name}\n` +
          `Progress: ${progress.toFixed(1)}% ($${nextGoal.currentAmount} of $${nextGoal.targetAmount})\n\n` +
          `Based on your current expenses ($${monthlyExpenses.toFixed(2)}/month), ` +
          `I recommend setting aside $${suggestedMonthlyContribution.toFixed(2)} monthly to reach your goal.\n\n` +
          `Would you like a detailed savings plan?`;
        
        response.suggestions = ['Create savings plan', 'Adjust goal', 'Show all goals'];
      }
    }
    
    // Help command
    else if (input.includes('help') || input.includes('what can you do')) {
      response.text = "I'm your advanced financial assistant. I can help you with:\n\n" +
        "🔍 Analysis:\n" +
        "- Spending pattern analysis\n" +
        "- Financial health assessment\n" +
        "- Budget tracking\n\n" +
        "💡 Recommendations:\n" +
        "- Personalized budget plans\n" +
        "- Savings strategies\n" +
        "- Goal planning\n\n" +
        "📊 Tracking:\n" +
        "- Balance monitoring\n" +
        "- Expense categorization\n" +
        "- Goal progress\n\n" +
        "What would you like to know about?";
      
      response.suggestions = [
        'Analyze my finances',
        'Create a budget plan',
        'Check my goals'
      ];
    }
    
    // Default response with smart suggestions
    else {
      response.text = "I'm not sure about that specific query, but I can help you with financial analysis, " +
        "budgeting, goal tracking, and personalized recommendations. What would you like to explore?";
      
      response.suggestions = [
        'Financial health check',
        'Spending analysis',
        'Budget recommendations'
      ];
    }

    return response;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botMessage = generateResponse(input);
      setMessages(prev => [...prev, botMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-blue-600 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              AI Financial Assistant
              <Sparkles className="w-4 h-4 ml-2" />
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Suggestions */}
                    {message.sender === 'bot' && message.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Brain className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isThinking}
              />
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isThinking ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isThinking}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FinancialChatbot;