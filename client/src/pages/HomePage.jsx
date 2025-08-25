import React, { useState, useEffect } from "react";
import { Form, Modal, Select, Input, message, Table, DatePicker, Tooltip } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  const [form] = Form.useForm(); // ✅ Ant Design form instance
  const APIUrl = "https://expense-management-xjkt.onrender.com"
  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    { title: "Amount", dataIndex: "amount" },
    { title: "Type", dataIndex: "type" },
    { title: "Category", dataIndex: "category" },
    { title: "Reference", dataIndex: "reference" },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer" }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => handleDelete(record)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  // Fetch transactions
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post(
        `${APIUrl}/api/v1/transactions/get-transaction`,
        {
          userid: user._id,
          frequency,
          selectedDate: selectedDate
            ? selectedDate.map((d) => d.format("YYYY-MM-DD"))
            : [],
          type,
        }
      );
      setAllTransaction(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Fetch issue with transaction");
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  // Delete transaction
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${APIUrl}/api/v1/transactions/delete-transaction`, {
        transactionId: record._id,
      });
      setLoading(false);
      message.success("Transaction deleted successfully");
      getAllTransactions();
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Unable to delete");
    }
  };

  // Edit transaction
  const handleEdit = (record) => {
    setEditable(record);
    setShowModal(true);

    // Populate form fields
    form.setFieldsValue({
      ...record,
      date: moment(record.date).format("YYYY-MM-DD"),
    });
  };

  // Add / update transaction
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);

      if (editable) {
        // Update
        await axios.post(`${APIUrl}/api/v1/transactions/edit-transaction`, {
          payload: { ...values, userId: user._id },
          transactionId: editable._id,
        });
        message.success("Transaction updated successfully");
      } else {
        // Add new
        await axios.post(`${APIUrl}/api/v1/transactions/add-transaction`, {
          ...values,
          amount: Number(values.amount),
          userid: user._id,
        });
        message.success("Transaction added successfully");
      }

      setLoading(false);
      setShowModal(false);
      setEditable(null);
      form.resetFields(); // ✅ clear form after submit
      getAllTransactions();
    } catch (error) {
      setLoading(false);
      message.error("Failed to save transaction");
    }
  };

  // Handle Add New click
  const handleAddNew = () => {
    setEditable(null);
    form.resetFields(); // clear previous data
    setShowModal(true);
  };

  return (
    <Layout>
      {loading && <Spinner />}

      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(val) => setFrequency(val)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(vals) => setSelectedDate(vals)}
            />
          )}
        </div>

        <div className="filter-tab">
          <h6>Select Type</h6>
          <Select value={type} onChange={(val) => setType(val)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
        </div>

        <div className="switch-icons">
          <Tooltip title="Table View">
            <UnorderedListOutlined
              className={`mx-2 ${viewData === "table" ? "active-icon" : ""}`}
              onClick={() => setViewData("table")}
              style={{ fontSize: 20, cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Analytics View">
            <AreaChartOutlined
              className={`mx-2 ${viewData === "analytics" ? "active-icon" : ""}`}
              onClick={() => setViewData("analytics")}
              style={{ fontSize: 20, cursor: "pointer" }}
            />
          </Tooltip>
        </div>

        <div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            Add New
          </button>
        </div>
      </div>

      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransaction} rowKey="_id" />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        mask={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Input placeholder="e.g. Salary, Food, Medical, Fees, Bills..." />
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
