import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import './ExpenseSubmission.css';

const ExpenseSubmission = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Meals',
    date: new Date().toISOString().split('T')[0],
    receipt: null,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Meals',
    'Travel',
    'Accommodation',
    'Transportation',
    'Office Supplies',
    'Software/Subscriptions',
    'Training/Education',
    'Marketing',
    'Equipment',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receipt') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.description || !formData.amount) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Expense submitted:', {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          description: '',
          amount: '',
          category: 'Meals',
          date: new Date().toISOString().split('T')[0],
          receipt: null,
          notes: ''
        });
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError('Failed to submit expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateOCR = () => {
    // Simulate OCR functionality
    setFormData(prev => ({
      ...prev,
      description: 'Restaurant Bill - Business Lunch',
      amount: '1250.00',
      category: 'Meals',
      date: new Date().toISOString().split('T')[0]
    }));
  };

  return (
    <div className="expense-submission-container">
      <Navigation />
      <div className="main-content">
        <div className="submission-content">
          <div className="page-header">
            <h1>Submit New Expense</h1>
            <p>Fill out the form below to submit your expense claim for approval.</p>
          </div>

          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <div>
                <strong>Expense Submitted Successfully!</strong>
                <p>Your expense has been submitted and is pending approval.</p>
              </div>
            </div>
          )}

          <div className="submission-card">
            <form onSubmit={handleSubmit} className="expense-form">
              {/* OCR Section */}
              <div className="ocr-section">
                <h3>📸 Quick Receipt Scan</h3>
                <p>Upload a receipt image and let our OCR technology auto-fill the details</p>
                <div className="ocr-actions">
                  <input
                    type="file"
                    name="receipt"
                    accept="image/*"
                    onChange={handleChange}
                    className="file-input"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="file-upload-btn">
                    📄 Upload Receipt
                  </label>
                  <button 
                    type="button" 
                    className="ocr-demo-btn"
                    onClick={simulateOCR}
                  >
                    🤖 Try OCR Demo
                  </button>
                </div>
                {formData.receipt && (
                  <p className="file-selected">Selected: {formData.receipt.name}</p>
                )}
              </div>

              <div className="form-divider">
                <span>OR FILL MANUALLY</span>
              </div>

              {/* Manual Form */}
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="description">
                    Description <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., Client lunch at Restaurant XYZ"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">
                    Amount (₹) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional details about this expense..."
                    rows="3"
                    className="form-input"
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  {error}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner">🔄</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="submit-icon">✅</span>
                      Submit Expense
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="tips-section">
            <h3>💡 Tips for Faster Approval</h3>
            <ul>
              <li>Provide clear, descriptive titles for your expenses</li>
              <li>Upload high-quality receipt images</li>
              <li>Include business justification in notes when necessary</li>
              <li>Ensure expense dates match receipt dates</li>
              <li>Submit expenses promptly after incurring them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSubmission;