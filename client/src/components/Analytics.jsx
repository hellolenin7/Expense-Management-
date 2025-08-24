import React from "react";
import { Progress } from "antd";
import pluralize from "pluralize";

const Analytics = ({ allTransaction }) => {
  // ✅ Normalize all categories (case-insensitive & singular)
  const normalizedCategories = [
    ...new Set(
      allTransaction.map((t) =>
        pluralize.singular(t.category.toLowerCase().trim())
      )
    ),
  ];

  // total transaction
  const totalTransaction = allTransaction.length;
  const totalIncomeTransaction = allTransaction.filter((t) => t.type === "income");
  const totalExpenseTransaction = allTransaction.filter((t) => t.type === "expense");
  const totalIncomePercent = (totalIncomeTransaction.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpenseTransaction.length / totalTransaction) * 100;

  // total turnover
  const totalTurnover = allTransaction.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomeTurnover = totalIncomeTransaction.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenseTurnover = totalExpenseTransaction.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <>
      <div className="row m-3">
        {/* Total Transactions */}
        <div className="col-md-3">
          <div className="card">
            <div
              className="p-2 text-light"
              style={{
                background: "linear-gradient(90deg, #7F00FF, #E100FF)",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              Total Transaction : {totalTransaction}
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-success mb-0">Income: {totalIncomeTransaction.length}</h6>
                <Progress type="circle" width={50} strokeColor="green" percent={totalIncomePercent.toFixed(0)} />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="text-danger mb-0">Expense: {totalExpenseTransaction.length}</h6>
                <Progress type="circle" width={50} strokeColor="red" percent={totalExpensePercent.toFixed(0)} />
              </div>
            </div>
          </div>
        </div>

        {/* Total Turnover */}
        <div className="col-md-3">
          <div className="card">
            <div
              className="p-2 text-light"
              style={{
                background: "linear-gradient(90deg, #7F00FF, #E100FF)",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              Total Balance Flow : {totalTurnover}
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-success mb-0">Income: {totalIncomeTurnover}</h6>
                <Progress type="circle" width={50} strokeColor="green" percent={totalIncomeTurnoverPercent.toFixed(0)} />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="text-danger mb-0">Expense: {totalExpenseTurnover}</h6>
                <Progress type="circle" width={50} strokeColor="red" percent={totalExpenseTurnoverPercent.toFixed(0)} />
              </div>
            </div>
          </div>
        </div>

        {/* Categorywise Income */}
        <div className="col-md-3">
          <h6
            className="p-2 text-light"
            style={{
              background: "linear-gradient(90deg, #11998e, #38ef7d)",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            Categorywise Income
          </h6>
          {normalizedCategories.map((category) => {
            const amount = allTransaction
              .filter(
                (t) =>
                  t.type === "income" &&
                  pluralize.singular(t.category.toLowerCase().trim()) === category
              )
              .reduce((acc, t) => acc + t.amount, 0);

            return (
              amount > 0 && (
                <div className="card mt-2" key={category}>
                  <div className="card-body">
                    <h6>{category}</h6>
                    <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                  </div>
                </div>
              )
            );
          })}
        </div>

        {/* Categorywise Expense */}
        <div className="col-md-3">
          <h6
            className="p-2 text-light"
            style={{
              background: "linear-gradient(90deg, #11998e, #38ef7d)",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            Categorywise Expense
          </h6>
          {normalizedCategories.map((category) => {
            const amount = allTransaction
              .filter(
                (t) =>
                  t.type === "expense" &&
                  pluralize.singular(t.category.toLowerCase().trim()) === category
              )
              .reduce((acc, t) => acc + t.amount, 0);

            return (
              amount > 0 && (
                <div className="card mt-2" key={category}>
                  <div className="card-body">
                    <h6>{category}</h6>
                    <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} strokeColor="red" />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>

      <div className="row mt-3 analytics"></div>
    </>
  );
};

export default Analytics;
