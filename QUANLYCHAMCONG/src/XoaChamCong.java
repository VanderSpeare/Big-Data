/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JFrame.java to edit this template
 */
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.JOptionPane;

public class XoaChamCong extends javax.swing.JFrame {

    public XoaChamCong() {
        initComponents();
        addActionListeners();
    }

    private void addActionListeners() {
        jButton1.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                TrangChu tc = new TrangChu();
                tc.setVisible(true);
                dispose();
            }
        });

        jButton2.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                xoaChamCong();
            }
        });
    }

    private void xoaChamCong() {
        String tenNhanVien = jTextField1.getText();
        Date ngayChamLuong = Date.valueOf(jTextField2.getText());

        if (tenNhanVien.isEmpty() || ngayChamLuong == null) {
            JOptionPane.showMessageDialog(this, "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try (Connection conn = DriverManager.getConnection("jdbc:sqlserver://DESKTOP-HGI7VB9:1433;databaseName=QUANLYCHAMCONG;user=sa;password=thai;")) {
            String maNhanVien = layMaNhanVien(tenNhanVien);
            
            if (maNhanVien != null) {
                if (kiemTraTonTai(maNhanVien, ngayChamLuong)) {
                    xoaChamCongDatabase(maNhanVien, ngayChamLuong);
                    JOptionPane.showMessageDialog(this, "Xóa chấm công thành công!");
                } else {
                    JOptionPane.showMessageDialog(this, "Không tìm thấy bản ghi chấm công. Vui lòng kiểm tra lại thông tin.");
                }
            } else {
                JOptionPane.showMessageDialog(this, "Không tìm thấy nhân viên. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Lỗi khi xóa chấm công. Vui lòng kiểm tra lại!");
        }
    }

    private String layMaNhanVien(String tenNhanVien) {
        try (Connection conn = DriverManager.getConnection("jdbc:sqlserver://DESKTOP-HGI7VB9:1433;databaseName=QUANLYCHAMCONG;user=sa;password=thai;")) {
            String query = "SELECT MaNhanVien FROM NHANVIEN WHERE HoTen = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setString(1, tenNhanVien);
                ResultSet rs = pstmt.executeQuery();
                if (rs.next()) {
                    return rs.getString("MaNhanVien");
                }
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return null;
    }

    private boolean kiemTraTonTai(String maNhanVien, Date ngayChamLuong) {
        try (Connection conn = DriverManager.getConnection("jdbc:sqlserver://DESKTOP-HGI7VB9:1433;databaseName=QUANLYCHAMCONG;user=sa;password=thai;")) {
            String query = "SELECT * FROM BANGCHAMCONG WHERE MaNhanVien = ? AND NgayChamCong = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setString(1, maNhanVien);
                pstmt.setDate(2, ngayChamLuong);
                return pstmt.executeQuery().next();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        }
    }

    private void xoaChamCongDatabase(String maNhanVien, Date ngayChamLuong) {
        try (Connection conn = DriverManager.getConnection("jdbc:sqlserver://DESKTOP-HGI7VB9:1433;databaseName=QUANLYCHAMCONG;user=sa;password=thai;")) {
            String deleteQuery = "DELETE FROM BANGCHAMCONG WHERE MaNhanVien = ? AND NgayChamCong = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(deleteQuery)) {
                pstmt.setString(1, maNhanVien);
                pstmt.setDate(2, ngayChamLuong);
                pstmt.executeUpdate();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jLabel1 = new javax.swing.JLabel();
        jTextField1 = new javax.swing.JTextField();
        jLabel2 = new javax.swing.JLabel();
        jTextField2 = new javax.swing.JTextField();
        jLabel3 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jButton2 = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel1.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        jLabel1.setText("Xóa Chấm Công");
        getContentPane().add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 30, 240, 40));
        getContentPane().add(jTextField1, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 110, 190, 30));

        jLabel2.setText("Tên nhân viên");
        getContentPane().add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(80, 110, 100, 30));
        getContentPane().add(jTextField2, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 160, 190, 30));

        jLabel3.setText("Ngày chấm lương");
        getContentPane().add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(80, 160, 110, 40));

        jButton1.setText("Thoát");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });
        getContentPane().add(jButton1, new org.netbeans.lib.awtextra.AbsoluteConstraints(510, 50, 80, 30));

        jButton2.setText("Xóa");
        getContentPane().add(jButton2, new org.netbeans.lib.awtextra.AbsoluteConstraints(90, 240, 90, 30));

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
        TrangChu tc=new TrangChu();
        tc.setVisible(true);
        this.dispose();
    }//GEN-LAST:event_jButton1ActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(XoaChamCong.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(XoaChamCong.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(XoaChamCong.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(XoaChamCong.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new XoaChamCong().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JTextField jTextField1;
    private javax.swing.JTextField jTextField2;
    // End of variables declaration//GEN-END:variables
}
