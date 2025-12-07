# 🚀 Quick Start Guide - CROWN Credit Accounts Module

## Getting Started in 3 Minutes

### 1. Start the Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### 2. Navigate to Credit Accounts

1. Click on **"Administration"** in the sidebar
2. Click on **"Credit Accounts"**

### 3. Try the Search

Use these test search criteria:

**Search by Name:**
```
First Name: MARÍA
Last Name: GARCÍA
```

**Search by Card:**
```
Card Number: 4152313471829283
```

**Search by Account:**
```
Account Number: 1234567890
```

### 4. View Account Details

1. Click on any search result
2. You'll see:
   - **Cardholder Tab**: Personal, contact, and tax information
   - **Cards Tab**: All cards associated with the account
   - **Account History**: (Coming soon)
   - **Documents**: (Coming soon)

### 5. Edit Cardholder Information

1. Expand any section (Personal, Contact, Tax)
2. Modify the information
3. Click **"Save Changes"** button (top right)
4. Success message will appear

## 🎯 Key Features to Try

### Search Features
- ✅ Multi-criteria search
- ✅ Real-time validation
- ✅ Click to view details
- ✅ "Additional Cards Only" filter

### Cardholder Management
- ✅ Expand/collapse sections
- ✅ Form validation (try entering invalid RFC or CURP)
- ✅ Dropdown selection for states, tax regimes, CFDI use
- ✅ Date picker for birth date

### Cards Display
- ✅ Visual card layout with status
- ✅ Summary metrics (total, active, blocked)
- ✅ Access methods display
- ✅ Credit limit formatting

## 🔍 Testing Data

The module includes 4 mock accounts:

| Card Number | Name | Account |
|------------|------|---------|
| 4152313471829283 | GARCÍA HERNÁNDEZ MARÍA JOSÉ | 1234567890 |
| 4152313471829291 | GARCÍA HERNÁNDEZ JUAN CARLOS | 1234567891 |
| 4152313471829309 | MARTÍNEZ LÓPEZ ANA LAURA | 1234567892 |
| 4152313471829317 | RODRÍGUEZ SÁNCHEZ PEDRO ANTONIO | 1234567893 |

## 🎨 UI Highlights

### Visual Design
- Clean Material Design interface
- Indigo color scheme (#6366F1)
- Smooth animations and transitions
- Responsive layout

### User Feedback
- Loading spinners during operations
- Colored snackbar notifications:
  - 🟢 Green for success
  - 🔴 Red for errors
  - 🔵 Blue for information
- Form validation with error messages

## 🛠️ Development Tips

### Hot Reload
Changes to components will automatically reload in the browser.

### Check Console
Open browser DevTools (F12) to see:
- State changes logged
- Navigation events
- API calls (mock delays simulated)

### Modify Mock Data
Edit `/src/app/core/services/accounts.service.ts`:

```typescript
private getMockAccounts() {
  // Add your test data here
}
```

## 📝 Common Tasks

### Add a New Search Criterion

1. Update `AccountSearchCriteria` in `account.model.ts`
2. Add form control in `search-panel.ts`
3. Add input field in `search-panel.html`
4. Update API service to handle new parameter

### Add a New Field to Cardholder

1. Update `Cardholder` interface in `cardholder.model.ts`
2. Add form control in `cardholder-tab.ts`
3. Add input field in `cardholder-tab.html`
4. Update mock data in `accounts.service.ts`

### Customize Validation

Edit `/src/app/shared/utils/validators.ts`:

```typescript
export function customValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Your validation logic
  };
}
```

## 🐛 Troubleshooting

### Build Errors?
```bash
npm run build
```
Check the output for specific errors.

### Styles Not Applying?
Ensure Tailwind is running correctly:
```bash
# Check if tailwind.config.css is imported in styles.css
```

### Navigation Not Working?
Check browser console for routing errors and ensure the route is registered in `app.routes.ts`.

## 🎓 Learn More

### Angular Signals
- [Official Signals Guide](https://angular.dev/guide/signals)
- Reactive state management
- Computed values
- Effects for side effects

### Angular Material
- [Component Library](https://material.angular.io/components)
- Form controls
- Layout components
- Theming

### Tailwind CSS
- [Documentation](https://tailwindcss.com/docs)
- Utility-first CSS
- Responsive design
- Custom theming

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Review the `CROWN_CREDIT_ACCOUNTS_MODULE.md` documentation
3. Examine the mock data in `accounts.service.ts`
4. Verify form validation messages

## 🎉 What's Next?

Once you're comfortable with the module:

1. **Connect to Real API**: Replace mock services
2. **Add Authentication**: Implement login and permissions
3. **Extend Features**: Add transaction history, documents
4. **Customize UI**: Adjust colors, layouts to match your brand
5. **Deploy**: Build for production with `npm run build`

---

**Enjoy building with the CROWN Credit Accounts Module!** 🚀
