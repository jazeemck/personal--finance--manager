
import streamlit as st
import pandas as pd
import numpy as np
import joblib
import io
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

st.set_page_config(page_title="Employee Performance – Unified App", layout="wide")
st.title("📊 Employee Performance – Unified Pipeline App")
st.caption("Preprocess → Verify → Train → Predict → Export")

# ---------- Helpers ---------- #
REQUIRED_TRAIN_COLS = {
    'EmployeeID', 'EmployeeName', 'Department', 'MonthlyTarget', 'ActualSales', 'Performance_Category'
}
REQUIRED_PREDICT_COLS = {
    'EmployeeID', 'EmployeeName', 'Department', 'MonthlyTarget', 'ActualSales'
}
MODEL_PATH = 'employee_performance_model.pkl'


def ensure_columns(df: pd.DataFrame, required: set, name: str):
    missing = [c for c in required if c not in df.columns]
    if missing:
        st.error(f"❌ {name}: Missing columns: {', '.join(missing)}")
        st.stop()


def compute_perf_percent(df: pd.DataFrame) -> pd.DataFrame:
    # Avoid division by zero
    df = df.copy()
    df['MonthlyTarget'] = pd.to_numeric(df['MonthlyTarget'], errors='coerce')
    df['ActualSales'] = pd.to_numeric(df['ActualSales'], errors='coerce')
    df['PerformancePercentage'] = np.where(
        (df['MonthlyTarget'].fillna(0) == 0),
        np.nan,
        (df['ActualSales'] / df['MonthlyTarget']) * 100
    )
    return df


def save_downloadable_df(df: pd.DataFrame, filename: str, label: str):
    towrite = io.BytesIO()
    df.to_excel(towrite, index=False)
    towrite.seek(0)
    st.download_button(
        label=label,
        data=towrite,
        file_name=filename,
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        use_container_width=True,
    )


# ---------- Sidebar Navigation ---------- #
section = st.sidebar.radio(
    "Go to section:",
    [
        "Data Preprocessing",
        "Data Verification",
        "Train Model",
        "Predict Performance",
        "About"
    ],
)

# ---------- Section: Data Preprocessing ---------- #
if section == "Data Preprocessing":
    st.header("🧹 Data Preprocessing")
    st.write("Upload your **raw Excel** file. We'll fill missing values and compute Performance %. No hardcoded paths.")

    raw_file = st.file_uploader("Upload raw employee performance data (.xlsx)", type=["xlsx"])
    if raw_file:
        raw_df = pd.read_excel(raw_file)
        st.subheader("Preview (first 10 rows)")
        st.dataframe(raw_df.head(10), use_container_width=True)

        with st.expander("Column info"):
            st.write(pd.DataFrame({
                'dtype': raw_df.dtypes.astype(str),
                'num_nulls': raw_df.isna().sum()
            }))

        # Light cleaning: forward-fill, compute PerformancePercentage if columns exist
        df = raw_df.copy()
        df = df.ffill()
        if {'MonthlyTarget', 'ActualSales'}.issubset(df.columns):
            df = compute_perf_percent(df)
        else:
            st.info("Could not compute PerformancePercentage because 'MonthlyTarget' or 'ActualSales' missing.")

        st.subheader("Processed Preview")
        st.dataframe(df.head(10), use_container_width=True)

        save_downloadable_df(df, 'processed_employee_performance_data.xlsx', '📥 Download processed Excel')
        st.success("✅ Preprocessing complete. You can move to **Data Verification** or **Train Model**.")

# ---------- Section: Data Verification ---------- #
elif section == "Data Verification":
    st.header("🔎 Data Verification")
    st.write("Upload a **processed** Excel (the one you downloaded from Preprocessing or your own). We'll summarize & plot.")

    proc_file = st.file_uploader("Upload processed data (.xlsx)", type=["xlsx"], key="verify")
    if proc_file:
        df = pd.read_excel(proc_file)

        st.subheader("Basic Checks")
        c1, c2, c3 = st.columns(3)
        with c1:
            st.metric("Rows", len(df))
        with c2:
            st.metric("Columns", len(df.columns))
        with c3:
            st.metric("Missing values", int(df.isna().sum().sum()))

        st.subheader("Data Types & Nulls")
        st.dataframe(pd.DataFrame({
            'dtype': df.dtypes.astype(str),
            'nulls': df.isna().sum()
        }), use_container_width=True)

        st.subheader("Summary stats (numeric)")
        st.dataframe(df.describe().T, use_container_width=True)

        # Plots (matplotlib)
        if {'MonthlyTarget', 'ActualSales'}.issubset(df.columns):
            import matplotlib.pyplot as plt

            st.subheader("Distributions")
            for col in ['MonthlyTarget', 'ActualSales']:
                fig, ax = plt.subplots()
                series = pd.to_numeric(df[col], errors='coerce').dropna()
                ax.hist(series, bins=30)
                ax.set_title(f"{col} – Histogram")
                ax.set_xlabel(col)
                ax.set_ylabel("Count")
                st.pyplot(fig, use_container_width=True)

            st.subheader("Boxplots")
            fig2, ax2 = plt.subplots()
            sub = df[['MonthlyTarget', 'ActualSales']].apply(pd.to_numeric, errors='coerce')
            ax2.boxplot([sub['MonthlyTarget'].dropna(), sub['ActualSales'].dropna()], labels=['MonthlyTarget', 'ActualSales'])
            ax2.set_title("MonthlyTarget vs ActualSales – Boxplots")
            st.pyplot(fig2, use_container_width=True)
        else:
            st.info("Add 'MonthlyTarget' and 'ActualSales' to see charts.")

# ---------- Section: Train Model ---------- #
elif section == "Train Model":
    st.header("🚀 Train Employee Performance Model")
    st.write("Upload a dataset with labels (`Performance_Category`). We'll train a RandomForest and save the model.")

    train_file = st.file_uploader("Upload labeled training data (.xlsx)", type=["xlsx"], key="train")

    col1, col2 = st.columns([1, 1])
    with col1:
        n_estimators = st.number_input("n_estimators (trees)", 50, 1000, 200, step=50)
    with col2:
        test_size = st.slider("Test size (hold-out %)", 0.1, 0.4, 0.2, step=0.05)

    if train_file:
        df = pd.read_excel(train_file)
        ensure_columns(df, REQUIRED_TRAIN_COLS, "Training data")

        # Compute PerformancePercentage for modeling
        df = compute_perf_percent(df)

        # Features & target (keep it simple/consistent with your earlier app)
        X = df[['MonthlyTarget', 'ActualSales', 'PerformancePercentage']]
        y = df['Performance_Category'].astype(str)

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y if len(y.unique()) > 1 else None
        )

        # Train model
        model = RandomForestClassifier(n_estimators=n_estimators, random_state=42)
        model.fit(X_train, y_train)

        # Evaluate
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        st.success(f"✅ Model trained. Accuracy: **{acc*100:.2f}%**")

        # Classification report
        report = classification_report(y_test, y_pred, zero_division=0)
        st.code(report, language='text')

        # Feature importance
        importances = getattr(model, 'feature_importances_', None)
        if importances is not None:
            imp_df = pd.DataFrame({
                'Feature': ['MonthlyTarget', 'ActualSales', 'PerformancePercentage'],
                'Importance': importances
            }).sort_values('Importance', ascending=False)
            st.subheader("Feature Importance")
            st.dataframe(imp_df, use_container_width=True)

        # Save model
        joblib.dump(model, MODEL_PATH)
        st.info(f"💾 Saved model → {MODEL_PATH}")

        # Cache in session too
        st.session_state['model'] = model

# ---------- Section: Predict Performance ---------- #
elif section == "Predict Performance":
    st.header("🔮 Predict Employee Performance Category")
    st.write("Upload **new** employee data (no Performance_Category). We'll compute Performance% and predict.")

    # Load model from session or disk
    model = st.session_state.get('model')
    if model is None and os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            st.session_state['model'] = model
            st.success("✅ Loaded saved model from disk.")
        except Exception as e:
            st.error(f"Could not load model from disk: {e}")

    if model is None:
        st.error("❌ No trained model found. Please train a model first in the 'Train Model' section.")
    else:
        new_file = st.file_uploader("Upload new data for prediction (.xlsx)", type=["xlsx"], key="predict")
        if new_file:
            df = pd.read_excel(new_file)
            ensure_columns(df, REQUIRED_PREDICT_COLS, "Prediction data")
            df = compute_perf_percent(df)

            # If PerformancePercentage didn't compute (e.g., MonthlyTarget 0), handle
            if 'PerformancePercentage' not in df.columns or df['PerformancePercentage'].isna().all():
                st.warning("PerformancePercentage has NaNs (likely MonthlyTarget is 0). These rows will still be sent to the model.")

            X = df[['MonthlyTarget', 'ActualSales', 'PerformancePercentage']]
            preds = model.predict(X)
            df['Predicted_Performance_Category'] = preds

            st.subheader("Predictions Preview")
            st.dataframe(df.head(20), use_container_width=True)

            # Top/Bottom performers by Performance%
            if 'PerformancePercentage' in df.columns:
                perf_sorted = df.sort_values('PerformancePercentage', ascending=False)
                c1, c2 = st.columns(2)
                with c1:
                    st.markdown("### 🏆 Top 5 by Performance %")
                    st.dataframe(perf_sorted.head(5)[['EmployeeID', 'EmployeeName', 'PerformancePercentage', 'Predicted_Performance_Category']], use_container_width=True)
                with c2:
                    st.markdown("### ⚠️ Bottom 5 by Performance %")
                    st.dataframe(perf_sorted.tail(5)[['EmployeeID', 'EmployeeName', 'PerformancePercentage', 'Predicted_Performance_Category']], use_container_width=True)

            # Save predictions to Excel for download
            save_downloadable_df(df, 'predicted_output.xlsx', '📥 Download Predictions')
            st.success("✅ Predictions ready and downloadable.")

# ---------- Section: About ---------- #
else:
    st.header("ℹ️ About this App")
    st.write(
        '''
        **Unified Pipeline:**
        - **Data Preprocessing:** Clean & compute performance % (no hardcoded paths).
        - **Data Verification:** Summary stats + histograms/boxplots.
        - **Train Model:** RandomForest on `MonthlyTarget`, `ActualSales`, `PerformancePercentage`.
        - **Predict:** Upload new data → predicted categories + Excel export.

        **Expected Columns**
        - For training: `EmployeeID, EmployeeName, Department, MonthlyTarget, ActualSales, Performance_Category`
        - For prediction: `EmployeeID, EmployeeName, Department, MonthlyTarget, ActualSales`

        **Tips**
        - Ensure `MonthlyTarget` isn't 0 to get a valid `PerformancePercentage`.
        - Keep category labels consistent between training and usage.
        - You can re-train anytime; the latest model is saved as `employee_performance_model.pkl`.
        '''
    )
