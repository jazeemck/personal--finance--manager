
import java.util.*; 
public class exceptionEx { 
public static void main(String[] args) { 
Scanner s = new Scanner(System.in); 
try { 
System.out.println("Enter two numbers to be divided:"); 
int num1 = s.nextInt(); 
int num2 = s.nextInt(); 
if (num2 == 0) { 
throw new IllegalArgumentException("Division by zero is not allowed"); 
} 
int result = num1 / num2; 
System.out.println("Result: " + result); 
} catch (ArithmeticException e) { 
System.out.println("Arithmetic Exception occurred: " + e.getMessage()); 
} catch (InputMismatchException e) { 
System.out.println("InputMismatchException occurred: " + e.getMessage()); 
} catch (IllegalArgumentException e) { 
System.out.println("IllegalArgumentException occurred: " + e.getMessage()); 
} 
try { 
System.out.println("Enter the size of the array:"); 
int size = s.nextInt(); 
if (size <= 0) { 
throw new IllegalArgumentException("Array size must be a positive integer"); 
} 
finally{ 
System.out.println(); 
System.out.println("Exception handling methods like try.. catch, throw and finally are demonstrated."); 
} 
s.close(); 
} 
}