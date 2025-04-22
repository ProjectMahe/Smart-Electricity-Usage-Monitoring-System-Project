import jsPDF from 'jspdf';
import { Bill, Receipt, User } from '../types';
import { format } from 'date-fns';

export const generateBillPDF = (bill: Bill, user: User): string => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(0, 114, 189);
  doc.text('EnergyTrack Solutions', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Smart Electricity Monitoring System', 105, 28, { align: 'center' });
  
  doc.setDrawColor(0, 114, 189);
  doc.line(20, 35, 190, 35);
  
  // Bill information
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('ELECTRICITY BILL', 20, 45);
  
  doc.setFontSize(11);
  doc.text(`Bill #: ${bill.id}`, 20, 55);
  doc.text(`Date: ${format(new Date(), 'MMM dd, yyyy')}`, 20, 62);
  doc.text(`Billing Period: ${bill.month} ${bill.year}`, 20, 69);
  doc.text(`Due Date: ${format(new Date(bill.dueDate), 'MMM dd, yyyy')}`, 20, 76);
  
  // Customer information
  doc.setFontSize(14);
  doc.text('CUSTOMER DETAILS', 20, 90);
  
  doc.setFontSize(11);
  doc.text(`Name: ${user.name}`, 20, 100);
  doc.text(`Address: ${user.address}`, 20, 107);
  doc.text(`Meter Number: ${user.meterNumber}`, 20, 114);
  doc.text(`Account ID: ${user.id}`, 20, 121);
  
  // Usage and charges
  doc.setFontSize(14);
  doc.text('USAGE DETAILS', 20, 135);
  
  // Create table headers
  doc.setFontSize(10);
  doc.setDrawColor(0);
  doc.line(20, 140, 190, 140);
  doc.text('Description', 22, 145);
  doc.text('Quantity', 90, 145);
  doc.text('Rate', 130, 145);
  doc.text('Amount', 170, 145);
  doc.line(20, 147, 190, 147);
  
  // Table content
  doc.text('Electricity Consumption', 22, 155);
  doc.text(`${bill.totalUsage} kWh`, 90, 155);
  doc.text('$0.12/kWh', 130, 155);
  doc.text(`$${bill.amount.toFixed(2)}`, 170, 155);
  
  doc.line(20, 165, 190, 165);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT DUE:', 130, 172);
  doc.text(`$${bill.amount.toFixed(2)}`, 170, 172);
  doc.setFont('helvetica', 'normal');
  
  // Payment status
  if (bill.paid) {
    doc.setTextColor(0, 150, 0);
    doc.text('PAID', 170, 180);
    doc.text(`Payment Date: ${format(new Date(bill.paidOn!), 'MMM dd, yyyy')}`, 130, 187);
    doc.setTextColor(0);
  } else {
    doc.setTextColor(255, 0, 0);
    doc.text('UNPAID', 170, 180);
    doc.setTextColor(0);
  }
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Thank you for using our services. For any queries, please contact support@energytrack.com', 105, 270, { align: 'center' });
  doc.text('© EnergyTrack Solutions - 2025', 105, 280, { align: 'center' });
  
  // Return as data URL
  return doc.output('datauristring');
};

export const generateReceiptPDF = (receipt: Receipt, bill: Bill, user: User): string => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(20);
  doc.setTextColor(0, 114, 189);
  doc.text('EnergyTrack Solutions', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text('Smart Electricity Monitoring System', 105, 28, { align: 'center' });
  
  doc.setDrawColor(0, 114, 189);
  doc.line(20, 35, 190, 35);
  
  // Receipt information
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('PAYMENT RECEIPT', 105, 45, { align: 'center' });
  
  doc.setFontSize(11);
  doc.text(`Receipt #: ${receipt.id}`, 20, 55);
  doc.text(`Date: ${format(new Date(receipt.paidOn), 'MMM dd, yyyy')}`, 150, 55);
  doc.text(`Transaction ID: ${receipt.transactionId}`, 20, 62);
  doc.text(`Payment Method: ${receipt.paymentMethod}`, 150, 62);
  
  // Customer information
  doc.setFontSize(14);
  doc.text('CUSTOMER DETAILS', 20, 75);
  
  doc.setFontSize(11);
  doc.text(`Name: ${user.name}`, 20, 85);
  doc.text(`Address: ${user.address}`, 20, 92);
  doc.text(`Meter Number: ${user.meterNumber}`, 20, 99);
  doc.text(`Account ID: ${user.id}`, 20, 106);
  
  // Bill details
  doc.setFontSize(14);
  doc.text('BILL DETAILS', 20, 120);
  
  doc.setFontSize(11);
  doc.text(`Bill #: ${bill.id}`, 20, 130);
  doc.text(`Billing Period: ${bill.month} ${bill.year}`, 20, 137);
  doc.text(`Total Usage: ${bill.totalUsage} kWh`, 20, 144);
  
  // Payment details
  doc.setFontSize(14);
  doc.text('PAYMENT DETAILS', 20, 158);
  
  // Create table headers
  doc.setFontSize(10);
  doc.setDrawColor(0);
  doc.line(20, 163, 190, 163);
  doc.text('Description', 22, 168);
  doc.text('Amount', 170, 168);
  doc.line(20, 170, 190, 170);
  
  // Table content
  doc.text(`Electricity Bill Payment (${bill.month} ${bill.year})`, 22, 178);
  doc.text(`$${receipt.paidAmount.toFixed(2)}`, 170, 178);
  
  doc.line(20, 183, 190, 183);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAID:', 130, 190);
  doc.text(`$${receipt.paidAmount.toFixed(2)}`, 170, 190);
  doc.setFont('helvetica', 'normal');
  
  // Payment status
  doc.setTextColor(0, 150, 0);
  doc.setFontSize(14);
  doc.text('PAYMENT SUCCESSFUL', 105, 205, { align: 'center' });
  doc.setTextColor(0);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Thank you for your payment. For any queries, please contact support@energytrack.com', 105, 270, { align: 'center' });
  doc.text('© EnergyTrack Solutions - 2025', 105, 280, { align: 'center' });
  
  // Return as data URL
  return doc.output('datauristring');
};