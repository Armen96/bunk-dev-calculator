/**
 * Expenses Calculator
 *
 * expenses - array: Specifies the expenses you want to calculate a payout on.
 * expense.name - string: The name of the person who incurred the expense.
 * expense.amount - number: The amount of the expense incurred.
 *
 * Note* we can split the function into more specific sub-functions and use the Single responsibility principle
 * But we need to run tests and basically can keep everything in one function.
 *
 * @param expenses
 */
export function expensesCalculator(expenses) {
  let output = {total: 0, equalShare: 0, payouts: []}

  if (expenses && Array.isArray(expenses) && expenses.length) {
    let usersHashMap = {}; // { bob: 12 , ...};
    let totalAmount = 0;
    let members;
    let payouts = [];

    // Handle total amount and users map
    expenses.forEach(expense => {
      if (usersHashMap[expense.name]) {
        usersHashMap[expense.name] = usersHashMap[expense.name] + expense.amount;
      } else {
        usersHashMap[expense.name] = expense.amount;
      }

      totalAmount += expense.amount;
    });

    // Unique users list
    members = Object.keys(usersHashMap);

    // Ideally we should use .toFixed(2) to avoid values like 8.333...4
    let equalShare = totalAmount / members.length;

    output.total = totalAmount;
    output.equalShare = equalShare;

    // Kill while loop if all members have equal amount
    let status = true;
    // For safety kill while loop after 200 operations
    let MAX_LOOP_NUMBER = 200;
    let count = 0;
    while (status) {
      // Stop process! System does not support big operation.
      count++;
      if (count > MAX_LOOP_NUMBER) {
        status = false;
        output.errorMessage = 'System does not support operations upper 100: Out of memory issue';
      }

      for (let i = 0; i < members.length; i++) {
        // If current member has less than avg then skip
        if (usersHashMap[members[i]] <= equalShare) {
          continue;
        }

        // Current user can and should share "diff" amount
        let diff = usersHashMap[members[i]] - equalShare;

        // Loop over all users: If j member has less then should take diff
        for (let j = 0; j < members.length; j++) {
          if (i === j) {
            continue;
          }

          if (usersHashMap[members[j]] < equalShare) {
            // How much j member needs
            let needed = equalShare - usersHashMap[members[j]];

            // If giver can overlap needs then everything is good and we can take all "diff"
            // If diff is bigger than we need then we take "needed" amount
            if (diff <= needed) {
              payouts.push({
                owes: members[j], // taker
                owed: members[i], // giver
                amount: diff
              })

              usersHashMap[members[i]] = usersHashMap[members[i]] - diff;
              usersHashMap[members[j]] = usersHashMap[members[j]] + diff;
            } else {
              payouts.push({
                owes: members[j], // taker
                owed: members[i], // giver
                amount: needed
              })

              usersHashMap[members[i]] = usersHashMap[members[i]] - needed;
              usersHashMap[members[j]] = usersHashMap[members[j]] + needed;
            }

            break;
          }
        }
      }

      // Check if all members has the same amount
      // If all have the same amount then kill the loop and return output
      let values = [...new Set(Object.values(usersHashMap).map(a => a.toFixed(5)))];
      if (values && values.length === 1) {
        status = false;
      }
    }

    output.payouts = payouts;
  }

  return output;
}
